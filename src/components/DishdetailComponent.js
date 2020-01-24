import React, { Component } from 'react';
import { Card, CardImg, CardText, CardBody, CardTitle, Breadcrumb, BreadcrumbItem, Button, Modal, ModalHeader, ModalBody, Col, Row, Label } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Control, LocalForm, Errors } from 'react-redux-form';

const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => (val) && (val.length >= len);

class CommentForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isCommentModalOpen: false
        };

        this.toggleCommentModal = this.toggleCommentModal.bind(this);
    }

    toggleCommentModal() {
        this.setState({ isCommentModalOpen: !this.state.isCommentModalOpen });
    }

    handleSubmit(values) {
        this.toggleCommentModal();
        this.props.addComment(this.props.dishId, values.rating, values.author, values.comment);
    }

    render() {
        return (
            <React.Fragment>
                <Button outline onClick={this.toggleCommentModal}>
                    <span className="fa fa-pencil fa-lg">Submit Comment</span>
                </Button>
                <Modal isOpen={this.state.isCommentModalOpen} toggle={this.toggleCommentModal} >
                    <ModalHeader toggle={this.toggleCommentModal}>Submit Comment</ModalHeader>
                    <ModalBody>
                        <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
                            <Label htmlFor="rating">Rating</Label>
                            <Row className="form-group">
                                <Col md={10}>
                                    <Control.select model=".rating" name="rating" className="form-control">
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>
                                    </Control.select>
                                </Col>
                            </Row>
                            <Label htmlFor="author">Your Name</Label>
                            <Row className="form-group">
                                <Col md={10}>
                                    <Control.text model=".author" name="author" className="form-control" validators={{ minLength: minLength(3), maxLength: maxLength(15) }}/>
                                    <Errors className="text-danger" model=".author" show="touched" messages={{ minLength: 'Must be greater than 2 characters', maxLength: 'Must be 15 characters or less'}} />
                                </Col>
                            </Row>
                            <Label htmlFor="comment">Comment</Label>
                            <Row className="form-group">
                                <Col md={10}>
                                    <Control.textarea model=".comment" name="comment" rows="6" className="form-control" />
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Col md={10}>
                                    <Button type="submit" color="primary">
                                        Submit
                                    </Button>
                                </Col>
                            </Row>
                        </LocalForm>
                    </ModalBody>
                </Modal>
            </React.Fragment>
        );
    }
}

function RenderDish({ dish }) {
    return (
        <div className="col-12 col-md-5 m-1">
            <Card>
                <CardImg width="100%" src={dish.image} alt={dish.name} />
                <CardBody>
                    <CardTitle>{dish.name}</CardTitle>
                    <CardText>{dish.description}</CardText>
                </CardBody>
            </Card>
        </div>
    )
}

function RenderComments({ comments, addComment, dishId }) {
    const cookedComments = comments.map((comment) => {
        return (
            <li key={comment.id}>
                <p>{comment.comment}</p>
                <p>-- {comment.author} , {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit' }).format(new Date(Date.parse(comment.date)))}</p>
            </li>
        )
    });
    return (
        <div className="col-12 col-md-5 m-1">
            <h4 className="text-left">Comments</h4>
            <ul className="list-unstyled text-left">
                {cookedComments}
            </ul>
            <div className="text-left">
                <CommentForm dishId={dishId} addComment={addComment} />
            </div>   
        </div>
    )
}

const DishDetail = (props) => {
    if (props.dish != null) {
        return (
            <div className="container">
                <div className="row">
                    <Breadcrumb>
                        <BreadcrumbItem><Link to='/menu'>Menu</Link></BreadcrumbItem>
                        <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                    </Breadcrumb>
                    <div className="col-12">
                        <h3>{props.dish.name}</h3>
                        <hr />
                    </div>
                </div>
                <div className="row">
                    <RenderDish dish={props.dish} />
                    <RenderComments comments={props.comments} addComment={props.addComment} dishId={props.dish.id} />
                </div>
            </div>
        );
    }
    else {
        return (
            <div></div>
        )
    }
}

export default DishDetail;