import React from 'react'
import {database} from './firebase'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import {List, ListItem} from 'material-ui/List';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import SocialMood from 'material-ui/svg-icons/social/mood';
import SocialMoodBad from 'material-ui/svg-icons/social/mood-bad';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import Toggle from 'material-ui/Toggle';


const dateToStr = (dateObj) => {
    let dateStr = dateObj.getFullYear() + '-' + (dateObj.getMonth() + 1) + '-' + dateObj.getDate();
    let timeStr = dateObj.getHours() + ':' + dateObj.getMinutes() + ':' + dateObj.getSeconds();
    let dateTimeStr = dateStr + ' ' + timeStr;
    return dateTimeStr
}

const Task = (props) => (
    <ListItem
        style={
            props.taskDone === false ?
                {textDecoration: 'none'}
                :
                {textDecoration: 'line-through', color: '#999'}
        }
        primaryText={props.taskName}
        secondaryText={props.dateToggle ? props.taskDate : null}
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
        taskName:'',
        tasksSelect:0,
        dateToggle:false,
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
                    dateAdd: dateToStr(new Date())
                }
            )
        this.setState({textFromInput: ''})
    }

    handleTaskName = (event, value) => {
        this.setState({taskName: value});
    };

    handleTasksSelect = (event, index, value) => this.setState({tasksSelect: value})

    handleDateToggle = (event, toggle) => this.setState({dateToggle: toggle})

    render() {
        return (
            <div>
                <TextField
                    hintText={"Do some stuff..."}
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
                        this.state.tasks
                            .filter((el) => el.name.indexOf(this.state.taskName) !== -1)
                            .filter((el) => (
                                this.state.tasksSelect === 0 ?
                                    true
                                    :
                                    this.state.tasksSelect === 1 ?
                                        el.done===false
                                        :
                                        el.done===true
                            ))
                            .map((el) => (
                            <Task
                                taskId={el.key} // mapped to obj
                                taskName={el.name}
                                taskDone={el.done}
                                taskDate={el.dateAdd}
                                deleteTask={this.deleteTask}
                                toggleDoneTask={this.toggleDoneTask}
                                dateToggle={this.state.dateToggle}
                                key={el.key}
                            />
                        ))
                    }
                </List>

                <Card>
                    <CardHeader
                        title="Filter your Todos"
                        actAsExpander={true}
                        showExpandableButton={true}
                    />
                    <CardText expandable={true} style={{textAlign: 'left'}}>
                        <TextField
                            floatingLabelText="Find your Todo ..."
                            fullWidth={true}
                            onChange={this.handleTaskName}
                        />
                        <SelectField
                            floatingLabelText="Todos status"
                            value={this.state.tasksSelect}
                            onChange={this.handleTasksSelect}
                            style={{display:'inline-block'}}
                        >
                            <MenuItem value={0} primaryText="All Todos" style={{color: "#BDBDBD"}}/>
                            <MenuItem value={1} primaryText="Undone Todos"/>
                            <MenuItem value={2} primaryText="Done Todos"/>
                        </SelectField>

                        <div style={{maxWidth:250, paddingTop:20}}>
                        <Toggle
                            label="Show dates"
                            style={{display:'inline-block'}}
                            onToggle={this.handleDateToggle}
                        />
                        </div>
                    </CardText>
                </Card>
            </div>
        )
    }
}

export default TodoDodo