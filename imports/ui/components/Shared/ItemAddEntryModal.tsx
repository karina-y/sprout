import React, { Component, ComponentClass, ReactElement } from "react";
import PropTypes from "prop-types";
import Modal from "react-bootstrap/Modal";
import { withTracker } from "meteor/react-meteor-data";
import autobind from "autobind-decorator";
import { ModalId } from "@enum/modalEnums";
import { TrackerEditingType, WaterDetailType } from "@enum";
import { Session } from "meteor/session";

interface IItemAddEntryModalProps {
  activeModalId: ModalId; //TODO enum this? is this really a bool?
  cancel: () => void;
  children: Array<ReactElement | undefined> | ReactElement;
  header?: string;
  modalId: ModalId;
  //TODO
  save: (type: ModalId | TrackerEditingType | WaterDetailType) => void; //TODO how tf is this working out? it's both tracker or add/delete? and is this the right types to use?
  editingType: WaterDetailType; //this is the name of the field we want to edit
}

interface IItemAddEntryModalState {
  show: boolean;
}

@autobind
class ItemAddEntryModal extends Component<
  IItemAddEntryModalProps,
  IItemAddEntryModalState
> {
  //TODO fill in propTypes
  static propTypes = {};

  constructor(props: IItemAddEntryModalProps) {
    super(props);

    this.state = {
      show: !!props.activeModalId,
    };
  }

  //TODO does this have to be static?
  static getDerivedStateFromProps(
    nextProps: IItemAddEntryModalProps,
    prevState: IItemAddEntryModalState,
  ) {
    if (nextProps.activeModalId === nextProps.modalId) {
      const newState = prevState;
      newState.show = true;
      return newState;
    } else {
      const newState = prevState;
      newState.show = false;
      return newState;
    }
  }

  saveData() {
    this.setState({
      show: false,
    });

    //TODO fix this when all uses have editingType
    this.props.save(this.props.editingType || this.props.modalId);
  }

  close() {
    //TODO why was i sending a param here?
    // this.props.cancel(this.props.modalId);
    this.props.cancel();
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

        {/*TODO make this an enum?*/}
        {this.props.modalId === ModalId.DELETE ? (
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
  editingType: PropTypes.string, //TODO make this required, and the interface above
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default withTracker((_props: any) => {
  console.log(
    "kytodo itemaddentrymodal withtracker _props.activeModalId",
    _props.activeModalId,
  );
  const activeModalId = Session.get("activeModalId");
  console.log(
    "kytodo itemaddentrymodal withtracker session activeModalId",
    activeModalId,
  );

  return {
    activeModalId,
  } as IItemAddEntryModalProps;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //@ts-ignore
})(ItemAddEntryModal) as ComponentClass<IItemAddEntryModalProps, any>; //TODO fix the getDerivedStateFromProps issue
