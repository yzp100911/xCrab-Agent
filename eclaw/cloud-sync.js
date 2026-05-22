/**
 * cloud-sync.js - 云服务器 SSH 隧道与数据同步模块
 *
 * 功能：
 * 1. 启动 SSH 隧道到云服务器 MySQL
 * 2. 提供通过隧道连接云 MySQL 的配置
 * 3. 备用：直接通过 SSH 执行 SQL 的同步接口
 */
const { spawn } = require('child_process');
const path = require('path');
const net = require('net');

// ====== 配置 ======
const SSH_KEY = path.join(process.env.USERPROFILE || 'C:\\Users\\Administrator', '.ssh', 'cloud_server_ed25519');
const SSH_HOST = 'ubuntu@119.29.196.58';
const DB_USER = 'wclaw_db';
const DB_PASS = '100911yzpYZP';
const DB_NAME = 'wclaw_db';

// 隧道本地监听端口
const TUNNEL_PORT = 3307;

// ====== SSH 隧道管理 ======
let tunnelProcess = null;

/**
 * 启动 SSH 隧道到云服务器 MySQL
 * @returns {Promise<void>}
 */
function startTunnel() {
    return new Promise((resolve, reject) => {
        if (tunnelProcess) {
            console.log('[Cloud Tunnel] 隧道已在运行中');
            return resolve();
        }

        tunnelProcess = spawn('ssh', [
            '-i', SSH_KEY,
            '-o', 'StrictHostKeyChecking=no',
            '-o', 'ConnectTimeout=10',
            '-o', 'ServerAliveInterval=30',
            '-o', 'ExitOnForwardFailure=yes',
            '-L', `${TUNNEL_PORT}:127.0.0.1:3306`,
            '-N',
            SSH_HOST
        ], {
            windowsHide: true,
            stdio: ['ignore', 'pipe', 'pipe']
        });

        let hasResolved = false;

        tunnelProcess.on('error', (err) => {
            console.error('[Cloud Tunnel] 启动失败:', err.message);
            tunnelProcess = null;
            if (!hasResolved) { hasResolved = true; reject(err); }
        });

        tunnelProcess.on('close', (code) => {
            console.log(`[Cloud Tunnel] 进程已退出 (code: ${code})`);
            tunnelProcess = null;
            if (!hasResolved) { hasResolved = true; reject(new Error(`SSH tunnel exited with code ${code}`)); }
        });

        tunnelProcess.stderr.on('data', (data) => {
            const msg = data.toString();
            // SSH 的调试信息可能输出到 stderr，忽略已知的提示
            if (msg.includes('Warning:') || msg.trim()) {
                console.log('[Cloud Tunnel]', msg.trim());
            }
        });

        // 等待隧道端口可用
        let retries = 0;
        const checkPort = setInterval(() => {
            const sock = new net.Socket();
            sock.setTimeout(1000);
            sock.on('connect', () => {
                sock.destroy();
                clearInterval(checkPort);
                if (!hasResolved) {
                    hasResolved = true;
                    console.log(`[Cloud Tunnel] SSH 隧道已建立 (127.0.0.1:${TUNNEL_PORT} → 云 MySQL:3306)`);
                    resolve();
                }
            });
            sock.on('error', () => {
                sock.destroy();
                retries++;
                if (retries > 15) { // 15 秒超时
                    clearInterval(checkPort);
                    if (!hasResolved) {
                        hasResolved = true;
                        reject(new Error('SSH tunnel port check timeout'));
                    }
                }
            });
            sock.connect(TUNNEL_PORT, '127.0.0.1');
        }, 1000);
    });
}

/**
 * 停止 SSH 隧道
 */
function stopTunnel() {
    if (tunnelProcess) {
        console.log('[Cloud Tunnel] 正在关闭隧道...');
        tunnelProcess.kill('SIGTERM');
        tunnelProcess = null;
    }
}

/**
 * 获取云 MySQL 连接配置（通过本地隧道）
 */
function getCloudDbConfig() {
    return {
        host: '127.0.0.1',
        port: TUNNEL_PORT,
        user: DB_USER,
        password: DB_PASS,
        database: DB_NAME,
        charset: 'utf8mb4',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    };
}

// ====== MySQL 转义工具 ======
function escapeSql(val) {
    if (val === null || val === undefined) return 'NULL';
    return "'" + String(val).replace(/'/g, "''") + "'";
}

// ====== 备用：直连 SSH 执行 SQL ======
function execSqlOnCloud(sql) {
    return new Promise((resolve, reject) => {
        const proc = spawn('ssh', [
            '-i', SSH_KEY,
            '-o', 'StrictHostKeyChecking=no',
            '-o', 'ConnectTimeout=10',
            SSH_HOST,
            `mysql -u ${DB_USER} -p${DB_PASS} ${DB_NAME}`
        ], {
            windowsHide: true,
            timeout: 15000
        });

        let stdout = '', stderr = '';
        proc.stdout.on('data', (d) => stdout += d);
        proc.stderr.on('data', (d) => stderr += d);

        proc.on('close', (code) => {
            if (code === 0) resolve(stdout);
            else reject(new Error(stderr || `exit code ${code}`));
        });
        proc.on('error', reject);

        proc.stdin.write(sql);
        proc.stdin.end();
    });
}

/**
 * 同步收藏到云服务器（备用接口）
 */
async function syncFavorite(username, msgId, content) {
    const sql = `INSERT INTO favorites (username, msg_id, content) VALUES (${escapeSql(username)}, ${escapeSql(msgId)}, ${escapeSql(content)}) ON DUPLICATE KEY UPDATE content = VALUES(content);`;
    try {
        await execSqlOnCloud(sql);
        console.log(`[Cloud Sync] 收藏已同步: ${username}/${msgId}`);
    } catch (err) {
        console.error('[Cloud Sync] 收藏同步失败:', err.message);
    }
}

/**
 * 从云服务器取消收藏同步（备用接口）
 */
async function unsyncFavorite(username, msgId) {
    const sql = `DELETE FROM favorites WHERE username = ${escapeSql(username)} AND msg_id = ${escapeSql(msgId)};`;
    try {
        await execSqlOnCloud(sql);
        console.log(`[Cloud Sync] 取消收藏已同步: ${username}/${msgId}`);
    } catch (err) {
        console.error('[Cloud Sync] 取消收藏同步失败:', err.message);
    }
}

module.exports = {
    startTunnel,
    stopTunnel,
    getCloudDbConfig,
    syncFavorite,
    unsyncFavorite
};
