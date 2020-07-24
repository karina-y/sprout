import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'react-autobind';
import Modal from 'react-bootstrap/Modal';
// import './ItemViewHistoryModal.scss';

class ItemViewHistoryModal extends Component {
  constructor(props) {
	super(props);

	this.state = {
	  show: false
	};

	autobind(this);
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


  close() {
	this.props.cancel(this.props.type);
  }


  render() {

	return (
			<Modal show={this.state.show}
				   onHide={this.close}
				   className="plant-view-data-modal">
			  <Modal.Header closeButton>
				{this.props.header}
			  </Modal.Header>

			  <Modal.Body>
				{this.props.children}
			  </Modal.Body>

			</Modal>
	)
  }
}

ItemViewHistoryModal.propTypes = {
  cancel: PropTypes.func.isRequired,
  type: PropTypes.string,
  header: PropTypes.string.isRequired,
  modalOpen: PropTypes.string
}

export default ItemViewHistoryModal;
