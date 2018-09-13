import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      posts: [],
    };
  }
  
  componentDidMount() {
    axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
    axios.get('/api/post')
      .then(res => {
        this.setState({ posts: res.data });
      })
      .catch((error) => {
          this.props.history.push("/login");      
      });
  }

  logout = () => {
    localStorage.removeItem('jwtToken');
    window.location.reload();
  }

  onDelete(index){
		axios.delete('/api/post/'+ this.state.posts[index]._id)
			.then((result) => { 
        console.log('post deleted');
        axios.delete('/api/post/comment/'+ this.state.posts[index]._id)
        .then(res => {
          console.log('deleted comment',res);
        })
        .catch((error) => {
          console.log('error',error);
        });
				axios.get('/api/post')
					.then(res => {
						this.setState({ posts: res.data });
					})
					.catch((error) => {
						console.log('error',error);
					});
			});
  }
  
  render() {
    return (
      <div class="container">
        <div class="panel panel-default">
          <div class="panel-heading">
            <h3 class="panel-title">
              BLOG &nbsp;
              {localStorage.getItem('jwtToken') &&
                <button class="btn btn-primary" onClick={this.logout}>Logout</button>
              }
            </h3>
          </div>
          <div class="panel-body">
            <h4><Link to="/create"><span class="glyphicon glyphicon-plus-sign" aria-hidden="true"></span> Add Post</Link></h4>
            <div>
                {this.state.posts.map((post,index)  =>
                <div class="article">
                  <div class ="article_date">
                    <div>Recording time: </div>
                    <div>{post.date}</div>
                  </div>
                  <div>{post.description}</div>
                    <div class ="article_author">
                    <div>Author: </div>
                    <div>{post.author}</div>
                  </div>
                  <div class ="article_author">                                                    
                    <div><Link to={`/showcomment/${this.state.posts[index]._id}`}>Comments: </Link></div>
                    <div>{post.comment.length}</div>
                  </div>
                  <div class ="article_buttons">
                    <div>
                      <button class="btn btn-warning"><Link to={`/update/${this.state.posts[index]._id}`}>Update<i class="glyphicon glyphicon-edit"></i></Link></button>
                    </div>
                    <div><button class="btn btn-danger" onClick={this.onDelete.bind(this,index)}>Delete<i class="fa fa-trash-o" aria-hidden="true"></i></button></div>
                    <div>
                      <button class="btn btn-primary"><Link to={`/addcomment/${this.state.posts[index]._id}`}>add comments</Link></button>
                    </div>
                  </div>
                </div>
                )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
