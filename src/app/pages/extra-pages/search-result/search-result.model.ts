
interface AllResult {
    id?: number;
    title?: string;
    url?: string;
    content?: string | UserResult;
}

interface UserResult {
    id?: number;
    userName?: string;
    email?: string;
    avatar?: string;
    bio?: string;
}

export { AllResult, UserResult };





