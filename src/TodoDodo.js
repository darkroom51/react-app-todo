import React from 'react'
import {database} from './firebase'

import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import {List, ListItem} from 'material-ui/List';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import SocialMood from 'material-ui/svg-icons/social/mood';
import SocialMoodBad from 'material-ui/svg-icons/social/mood-bad';


const Task = (props) => (
    <ListItem
        style={
            props.taskDone === false ?
                {textDecoration: 'none'}
                :
                {textDecoration: 'line-through', color: '#999'}
        }
        primaryText={props.taskName}
        rightIcon={<ActionDelete onClick={() => props.deleteTask(props.taskId)}/>}
        leftIcon={
            props.taskDone === false ?
                <SocialMoodBad onClick={() => props.toggleDoneTask(props.taskId, props.taskDone)}/>
                :
                <SocialMood onClick={() => props.toggleDoneTask(props.taskId, props.taskDone)}/>
        }
    />
)

class TodoDodo extends React.Component {
    state = {
        tasks: null,
        textFromInput: '',
    }

    componentWillMount() {
        database.ref('/TodoDodo')
            .on('value', (snapshot) => {
                    const arrTasks = Object.entries(
                        snapshot.val() || {}).map(([key, value]) => {
                        value.key = key;
                        return value
                    })
                    this.setState({tasks: arrTasks})
                }
            )
    }

    deleteTask = (taskId) => {
        database.ref('/TodoDodo/' + taskId)
            .remove()
    }

    toggleDoneTask = (taskId, taskDone) => {
        database.ref('/TodoDodo/' + taskId)
            .update({done: !taskDone})
            .then(() => console.log('toggleDoneTask resolved OK'))
    }

    // handleTextFromInput = (e, val) => {
    //     this.setState({textFromInput: e.target.value})
    // }

    handleAddTask = () => {
        if (!this.state.textFromInput) {
            alert('empty input');
            return
        }

        database.ref('/TodoDodo')
            .push(
                {
                    name: this.state.textFromInput,
                    done: false,
                    dateAdd: Date.now()
                }
            )
        this.setState({textFromInput: ''})
    }

    render() {
        return (
            <div>
                <TextField
                    hintText={"Do something nice..."}
                    fullWidth={true}
                    value={this.state.textFromInput}
                    onChange={(e, value) => this.setState({textFromInput: value})} // onChange={this.handleTextFromInput}
                />
                <RaisedButton
                    label={"add"}
                    primary={true}
                    fullWidth={true}
                    onClick={this.handleAddTask}
                />

                <List style={{textAlign: 'left'}}>
                    {
                        this.state.tasks // uniknij null za pierwszym zaladowaniem, zanim dane przyjda z bazy
                        &&
                        this.state.tasks.map((el) => (
                            <Task
                                taskId={el.key} // mapped to obj
                                taskName={el.name}
                                taskDone={el.done}
                                taskDate={el.dateAdd}
                                deleteTask={this.deleteTask}
                                toggleDoneTask={this.toggleDoneTask}
                                key={el.key}
                            />
                        ))
                    }
                </List>
            </div>
        )
    }
}

export default TodoDodo