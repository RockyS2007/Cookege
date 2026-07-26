function List(props: any) {     

    const itemList = props.items;
    const category = props.category;

    // fix this type
    const listItems = itemList.map(item => <li key={item.id}>{item.name}: &nbsp; 
                                            <b>{item.calories} cal</b></li>);

    return (<>
            <h3 className="list-category">{category}</h3>
            <ul className="list-items">{listItems}</ul>
            </>);
}

export default List;