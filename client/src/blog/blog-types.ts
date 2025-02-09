export interface IBlogImage {
    data: Buffer;
    contentType: string;
}

export interface Blog {
    _id: string,
    name: string,
    content: string,
    images: IBlogImage[]
}

export interface BlogCredentials {
    name: string,
    content: string,
    images: File[]
}

export const DefaultBlogCredentials = {
    name: "",
    content: "",
    images: []
}