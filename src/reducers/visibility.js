const toggleVisibility = (arr, id) => {
    console.log('arr: ', arr);
    let files = arr.slice();
    for(let i=0; i<files.length; i++) {
        if(files[i].id===id)
            files[i].visible=!files[i].visible;
        return files;
    }
}

const visibility = (state=[], action={}) => {
    switch(action.type){
        case 'TOGGLE_VISIBILITY':
            return toggleVisibility(state.files, action.id);
        default:
            return state;
    }
}

export default visibility;