type Page_404 = {
    errorCode: string;
    message: string;
    goHome: string;
}

export type Page = {
    page_404: Page_404;
}
export const notFoundPage: Page = {
    page_404: {
        errorCode: "404",
        message: "Oops! The page you're looking for doesn't exist or has been moved.",
        goHome: "Go Home"
    }
}