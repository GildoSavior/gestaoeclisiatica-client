// utils/mode.util.ts
export class ModeUtil {
    static getCurrentMode(url: string): 'admin' | 'client' {
        return url.startsWith('/admin') ? 'admin' : 'client';
    }
}
