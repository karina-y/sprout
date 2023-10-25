import React, { Component } from "react";
import PropTypes from "prop-types";
import autobind from "react-autobind";
import Modal from "react-bootstrap/Modal";
import { withTracker } from "meteor/react-meteor-data";

class ItemAddEntryModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      show: props.activeModalId,
    };

    autobind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.activeModalId === nextProps.type) {
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
      show: false,
    });

    this.props.save(this.props.modalId);
  }

  close() {
    this.props.cancel(this.props.modalId);
  }

  render() {
    return (
      <Modal
        show={this.state.show}
        onHide={this.close}
        className="plant-view-data-modal"
      >
        <Modal.Header closeButton>{this.props.header}</Modal.Header>

        <Modal.Body>{this.props.children}</Modal.Body>

        {this.props.modalId === "delete" ? (
          <Modal.Footer>
            <button onClick={this.close} className="flat">
              Cancel
            </button>

            <button onClick={this.saveData} className="flat">
              Yes
            </button>
          </Modal.Footer>
        ) : (
          <Modal.Footer>
            <button onClick={this.close} className="flat">
              Cancel
            </button>

            <button onClick={this.saveData} className="flat">
              Save
            </button>
          </Modal.Footer>
        )}
      </Modal>
    );
  }
}

ItemAddEntryModal.propTypes = {
  save: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
  modalId: PropTypes.string,
  header: PropTypes.string,
  activeModalId: PropTypes.string,
};

export default withTracker(() => {
  const activeModalId = Session.get("activeModalId");
  return {
    activeModalId: activeModalId,
  };
})(ItemAddEntryModal);
