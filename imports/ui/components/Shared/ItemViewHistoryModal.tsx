import React, { Component, ReactElement } from "react";
import PropTypes from "prop-types";
import Modal from "react-bootstrap/Modal";
import { RouteComponentPropsCustom } from "@type";
import autobind from "autobind-decorator";
import { ModalId, UpdateType } from "@enum";

// import './ItemViewHistoryModal.scss';

interface IItemViewHistoryModalProps extends RouteComponentPropsCustom {
  activeModalId: ModalId; //TODO enum this? is this really a bool?
  cancel: (type: UpdateType | ModalId) => void;
  children: Array<ReactElement>;
  header: string;
  modalIdToDisplay: string;
  save: (type: UpdateType | ModalId) => void; //TODO how tf is this working out? it's both tracker or add/delete?
  show: string; //TODO this isn't in proptypes? do i need it or is it old pasted code?
  type: UpdateType | ModalId; //TODO is his correct?
}

interface IItemViewHistoryModalState {
  show: boolean;
}

@autobind
class ItemViewHistoryModal extends Component<
  IItemViewHistoryModalProps,
  IItemViewHistoryModalState
> {
  //TODO fill in propTypes
  static propTypes = {};

  constructor(props: IItemViewHistoryModalProps) {
    super(props);

    this.state = {
      show: false,
    };

    console.log(
      "kytodo ItemViewHistoryModal props.activeModalId",
      props.activeModalId,
    );
  }

  static getDerivedStateFromProps(
    nextProps: IItemViewHistoryModalProps,
    prevState: IItemViewHistoryModalState,
  ) {
    if (nextProps.show === nextProps.type) {
      const newState = prevState;
      newState.show = true;
      return newState;
    } else {
      const newState = prevState;
      newState.show = false;
      return newState;
    }
  }

  close() {
    this.props.cancel(this.props.type);
  }

  //TODO do i still need nextprops/nextstate?
  render() {
    return (
      <Modal
        show={this.props.activeModalId === this.props.modalIdToDisplay}
        onHide={this.close}
        className="plant-view-data-modal"
      >
        <Modal.Header closeButton>{this.props.header}</Modal.Header>

        <Modal.Body>{this.props.children}</Modal.Body>
      </Modal>
    );
  }
}

ItemViewHistoryModal.propTypes = {
  cancel: PropTypes.func.isRequired,
  type: PropTypes.string,
  header: PropTypes.string.isRequired,
  activeModalId: PropTypes.string,
  modalIdToDisplay: PropTypes.string,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default ItemViewHistoryModal as any;
