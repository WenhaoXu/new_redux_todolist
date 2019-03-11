export default (state = {currentPage: 0, items: []}, action) => {

    let payload = action.payload;
    switch (action.type) {
        case "INIT_STATE":
            return {
                currentPage: 0,
                items: payload
            };

        case "CHANGE_PAGE":
            return {
                currentPage: payload,
                items: state.items
            };

        case "CHANGE_STATUS":
            let id = payload.id;
            let newItems = state.items.map(item => {
                if (item.id === id) {
                    return action.payload;
                } else {
                    return item;
                }
            });
            return {
                currentPage: state.currentPage,
                items: newItems
            };
        case  "ADD_ITEM":
            return {
                currentPage: state.currentPage,
                items: [...state.items, payload]
            };
        case "DELETE_ITEM":
            let newItemList=state.items.filter(item=>
                item.id!=payload
            )
            return{
                currentPage: state.currentPage,
                items:newItemList
            };
        default:
            return state;
    }
}