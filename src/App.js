import React, {Component} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import AppBar from 'material-ui/AppBar'
import Paper from 'material-ui/Paper'
import TodoDodo from './TodoDodo'

const paperStyles = {
    margin: 20,
    padding: 20,
    textAlign: 'center'
}

class App extends Component {
    render() {
        return (
            <MuiThemeProvider>
                <div>
                    <AppBar
                        title="Todo Dodo React"
                    />
                    <Paper style={paperStyles}>
                        <TodoDodo/>
                    </Paper>
                </div>
            </MuiThemeProvider>
        );
    }
}

export default App;
