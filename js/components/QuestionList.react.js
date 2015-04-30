// Creates list view of questions, from QuestionBox, QuestionList, Question, and QuestionForm components

var QuestionBox = React.createClass({
  loadQuestionsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  handleQuestionSubmit: function(newQuestion) {
    var questionObject = {
      question: newQuestion
    }
    var questions = this.state.data;
    var newQuestions = [questionObject].concat(questions);
    this.setState({data: newQuestions});
    //Submit to server and refresh the list
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: newQuestion,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  getInitialState: function() {
    return {data:[]};
  },

  componentDidMount: function() {
    this.loadQuestionsFromServer();
    setInterval(this.loadQuestionsFromServer, this.props.pollInterval);
  },

  render: function() {
    return (
      <div className="questionBox">
        <h1>Questions</h1>
        <QuestionList data={this.state.data} />
        <QuestionForm onQuestionSubmit={this.handleQuestionSubmit} />
      </div>
    );
  }
});

var QuestionList = React.createClass({
  render: function() {
    var questionNodes = this.props.data.map(function (question) {
      return (
        <Question>
          {question.question.label}
          <Answer>
            {question.question.answer.text}
          </Answer>
        </Question>
      );
    });
    return (
      <div className="questionList">
        {questionNodes}
      </div>
    );
  }
});

var QuestionForm = React.createClass({
  handleSubmit: function(e){
    e.preventDefault();
    var label = React.findDOMNode(this.refs.label).value.trim();
    if (!label) {
      return
    }
    this.props.onQuestionSubmit({label: label});
    React.findDOMNode(this.refs.label).value = '';
    return;
  },
  render: function() {
    return (
      <form className="questionForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="I'd really like to know..." ref="label"/>
        <input type="submit" value="Post" />
      </form>
    );
  }
});

var Question = React.createClass({
  render: function() {
    return (
      <div className="question">
        {this.props.children}
        <Answer>
        </Answer>
      </div>
    );
  }
});

var Answer = React.createClass({
  render: function() {
    return (
      <div className="answer">
        {this.props.children}
      </div>
    );
  }
});


React.render(
  <QuestionBox url="http://localhost:9292/questions" pollInterval={1000}/>,
  document.getElementById('content')
);