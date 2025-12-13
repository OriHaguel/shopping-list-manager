export async function getMessages(locale: string) {
    try {
        return (await import(`../../public/locales/${locale}.json`)).default;
    } catch {
        return null;
    }
}
