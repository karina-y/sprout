import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
// import './ProfileViewEditModal.scss';
import autoBind from 'react-autobind'

class ProfileViewEditModal extends Component {
  constructor(props) {
	super(props);

	this.state = {
	  show: false
	};

	autoBind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {

	if (nextProps.show === nextProps.type) {
	  let newState = prevState;
	  newState.show = true;
	  return newState;
	} else {
	  let newState = prevState;
	  newState.show = false;
	  return newState;
	}
  }

  saveData() {
	this.setState({
	  show: false
	});

	this.props.save(this.props.type)
  }

  close() {
	this.props.cancel(this.props.type);
  }


  render() {

	return (
			<Modal show={this.state.show}
				   onHide={this.close}
				   className="profile-view-data-modal">
			  <Modal.Header closeButton>
				{this.props.header}
			  </Modal.Header>

			  <Modal.Body>
				{this.props.children}
			  </Modal.Body>

			  {this.props.type === "delete" ?
					  <Modal.Footer>
						<button onClick={this.close}
								className="flat">
						  Cancel
						</button>

						<button onClick={this.saveData}
								className="flat">
						  Yes
						</button>
					  </Modal.Footer>
					  :
					  <Modal.Footer>
						<button onClick={this.close}
								className="flat">
						  Cancel
						</button>

						<button onClick={this.saveData}
								className="flat">
						  Save
						</button>
					  </Modal.Footer>
			  }
			</Modal>
	)
  }
}

ProfileViewEditModal.propTypes = {
  save: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  header: PropTypes.string.isRequired,
  modalOpen: PropTypes.string
}

export default ProfileViewEditModal;
