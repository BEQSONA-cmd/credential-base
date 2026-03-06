export type CredentialField = {
    id: string;
    value: string;
    type: 'email' | 'password' | 'text';
};

export type Credential = {
    id: string;
    name: string;
    createdAt: Date;
    fields: CredentialField[];
};