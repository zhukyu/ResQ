export const appwriteConfig = {

}

export const getCurrentUser = async () => {
    // sleep
    await new Promise(resolve => setTimeout(resolve, 2000));

    // return {username: 'test', email: 'test@gmail.com', password: 'test'};
    return null;
}

export const signIn = async (email, password) => {
    // sleep
    await new Promise(resolve => setTimeout(resolve, 2000));

    return {username: 'test', email: email, password: password};
}
