import Session from '../../interfaces/session.interface';

async function querySelectSessionBySecret(
    secret: string
): Promise<Session | null> {
    const currentTime = new Date().getTime() / 1000;
    const session: Session = {
        id: 1,
        userId: 1,
        secret: '123',
        expires: currentTime + 1234,
        invalidated: false,
    };
    return session.secret === secret ? session : null;
}

export { querySelectSessionBySecret };
