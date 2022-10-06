import { OkPacket, Pool, ResultSetHeader, RowDataPacket } from 'mysql2';
import crypto from 'crypto';
import Session from '../interfaces/session.interface';

const queryInsertSession = async (
    pool: Pool,
    user_id: number,
    length: number
) => {
    const promisePool = pool.promise();
    let secret;
    do {
        secret = crypto.randomBytes(16).toString('hex');
    } while (
        [
            await promisePool.query(
                'SELECT secret FROM sessions WHERE secret = ?',
                { secret }
            ),
        ] != null
    );

    const expiry = new Date().getTime() / 1000 + length;
    const res = await promisePool.query<ResultSetHeader>(
        'INSERT INTO sessions (user_id, secret, expires) VALUES (?)',
        { user_id, secret, expiry }
    );
    return res[0].affectedRows != 0;
};

export { queryInsertSession };
