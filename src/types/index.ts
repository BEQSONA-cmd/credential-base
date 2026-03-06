export type CredentialField = {
    id: string;
    label: string;
    value: string;
    type: 'text' | 'password' | 'multiline';
};

export type Credential = {
    id: string;
    name: string;
    createdAt: number;
    fields: CredentialField[];
};