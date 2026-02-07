export const config = {
    matcher: '/(.*)',
};

export default function middleware(request) {
    const authHeader = request.headers.get("authorization");

    if (authHeader) {
        const encoded = authHeader.split(" ")[1];
        const [user, pass] = atob(encoded).split(":");

        if (
            user === process.env.BASIC_AUTH_USER &&
            pass === process.env.BASIC_AUTH_PASSWORD
        ) {
            // 認証成功 → 何も返さず処理を通過
            return; // ← これでOK
        }
    }

    // 認証失敗 → Basic認証ダイアログを表示
    return new Response("認証が必要です。\nログインフォームが出ない場合は、Google Chrome等の外部サイトを使用してください。", {
        status: 401,
        headers: {
            "WWW-Authenticate": 'Basic realm="Secure Area"',
        },
    });
}
