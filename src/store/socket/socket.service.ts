export const getWsBrowserToken = () => {
    const token =
        localStorage.getItem('WS_BROWSER_TOKEN') ||
        (Math.random() + 1).toString(36).substring(7);
    if (!localStorage.getItem('WS_BROWSER_TOKEN'))
        localStorage.setItem('WS_BROWSER_TOKEN', token);
    return token;
};
