import axios from "axios";

export interface Test {
    field_1: string;
}

const instance = axios.create({
    baseURL: 'http://localhost:4000'
});

export const postTest = async (test: Test) => {
    return await instance.post('/test', test)
}

export const getTests = async (): Promise<Test[]> => {
    const response = await instance.get('/tests')

    return response.data as Test[];
};
