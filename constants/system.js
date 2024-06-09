const USER_STATUS = {
    ACTIVE: 1,
    DELETE: 0,
};

const REQUEST_STATUS = {
    PENDING: 0,
    RESCUING: 1,
    RESCUED: 2,
    REJECTED: 3,
};

const VOTE_TYPE = {
    UPVOTE: 1,
    DOWNVOTE: 0,
    NONE: 2,
};

const USER_ROLE = {
    ADMIN: "admin",
    USER: "user",
    RESCUER: "rescuer",
};

const system = {
    refreshTime: 9 * 60 * 1000,
    END_POINT_URL: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
    GOOGLE_MAP_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,

    USER_STATUS,
    REQUEST_STATUS,
    VOTE_TYPE,
    USER_ROLE,
};

export default system;
