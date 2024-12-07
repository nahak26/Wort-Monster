import { fetchWordSetByName, fetchWordSetsByCreators, fetchWordSetsContainWords } from "../service/wordSetService";
import { fetchWordsByQuery } from "../service/wordService";
import { fetchUsersByName } from "../service/userService";

export const searchPublicWordSets = async (query, filter) => {
    //console.log(`query: ${query}, filter: ${filter}`);
    if (filter === "name") {
        return await fetchWordSetByName(query);
    } else if (filter === "word"){
        const wordIdData = await fetchWordsByQuery(query);
        const wordIds = wordIdData.map((item) => item.id);
        const setData = await fetchWordSetsContainWords(wordIds);
        //console.log(`Search results from word "${query}":`);
        //console.log("word ids: ", wordIds);
        //console.log("sets: ", setData);
        return setData;
    } else if (filter === "creator"){
        const UserIdData = await fetchUsersByName(query);
        const userIds = UserIdData.map((item) => item.id);
        const setData = await fetchWordSetsByCreators(userIds);
        //console.log(`Search results from name "${query}":`);
        //console.log("user ids: ", UserIdData);
        //console.log("sets: ", setData);
        return setData;
    }
};
