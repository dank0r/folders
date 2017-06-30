const search = (state=[], action={}) => {
    switch(action.type) {
        case 'CHANGE_DEEP':
            return {
                files: state.files,
                isDeep: action.deep,
                q: state.q
            }
        case 'SEARCH_QUERY':
            return {
                files: state.files,
                isDeep: state.isDeep,
                q: action.q
            }
        default:
            return state;
    }
}

export default search;