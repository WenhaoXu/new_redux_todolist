import {Card, Checkbox, Container, Input, Item, Button, Menu} from 'semantic-ui-react'

import './app.css';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import 'whatwg-fetch'

class App extends Component {

    componentDidMount() {

        let {initState} = this.props;
        let promise = fetch("http://localhost:1234/todoItems");
        promise.then(value => {
            value.json().then(value1 => {
                initState(value1)
            })
        })
    }

    render() {
        let {items, currentPage, handleFilterClick, handleItemClick, handleAddItem,handleItemDelete} = this.props;
        let input;
        return (
            (
                <div className="wrap">
                    <Container>
                        <Card >
                            <Card.Content>
                                <Input placeholder='ANYTHING...' ref={node => input = node}
                                       onChange={(e) => input.value = e.target.value}/>
                                <Button content='ADD' style={{margin: " 0 0 0 5px"}}
                                        onClick={() => handleAddItem(input.value)}/>
                            </Card.Content>
                            <Card.Content>
                                <Item.Group divided>
                                    {
                                        items
                                            .filter(item => {
                                                if (currentPage === 1) {
                                                    return !item.finished
                                                } else if (currentPage === 2) {
                                                    return item.finished
                                                } else {
                                                    return true
                                                }
                                            })
                                            .map(item =>
                                                <Item key={item.id}>
                                                    <Item.Content verticalAlign='middle'>
                                                        <Checkbox
                                                            checked={item.finished}
                                                            onClick={() => handleItemClick(item.id, item.title, !item.finished)}/>
                                                        <span style={{position:'relative',bottom:'5px',left:'10px',fontSize:'15px',color:"#434343"}}>{item.title}</span>
                                                        <Button  onClick={() => handleItemDelete(item.id)}>delete</Button>
                                                    </Item.Content>
                                                </Item>)
                                    }
                                </Item.Group>
                            </Card.Content>
                            <Card.Content>
                                <Menu secondary>
                                    <Menu.Item name='ALL' active={currentPage === 0}
                                               onClick={() => handleFilterClick(0)}/>
                                    <Menu.Item name='ACTIVE' active={currentPage === 1}
                                               onClick={() => handleFilterClick(1)}/>
                                    <Menu.Item name='FINISHED' active={currentPage === 2}
                                               onClick={() => handleFilterClick(2)}/>
                                </Menu>
                            </Card.Content>
                        </Card>
                    </Container>
                </div>
            )
        );
    }
}

function mapStateToProps(state) {
    return state;
}

function mapDispatchToProps(dispatch) {
    return {
        initState: (state) => {
            dispatch({
                type: "INIT_STATE",
                payload: state
            })
        },
        handleFilterClick: (index) => {
            dispatch({
                type: "CHANGE_PAGE",
                payload: index
            })
        },
        handleItemClick: (id, title, finished) => {
            let headers = new Headers();
            fetch("http://localhost:1234/todoItems", {
                method: "PUT",
                body: JSON.stringify({
                    id,
                    title,
                    finished
                }),
                headers:  {
                    'Content-Type': 'application/json'
                }
            }).then(resp => {
                resp.json().then(value => {
                    dispatch({
                        type: "CHANGE_STATUS",
                        payload: value
                    })
                })
            });

        },
        handleItemDelete:(id)=>{
            fetch("http://localhost:1234/todoItems", {
                method: "DELETE",
                headers:  {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id
                })
            }).then(resp => {
                dispatch({
                    type: "DELETE_ITEM",
                    payload: id
                });
            })
        },
        handleAddItem: (title) => {
            let body = new FormData();
            body.append("title", title);
            fetch("http://localhost:1234/todoItems", {
                method: "POST",
                headers:  {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title
                })
            }).then(resp => resp.json().then(value => {
                dispatch({
                    type: "ADD_ITEM",
                    payload: value
                });
            }))
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);



