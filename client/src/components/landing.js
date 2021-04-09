import React from 'react';
import {Button, Modal, ModalHeader, ModalBody} from 'reactstrap';
import CreateSession from './createSession';
import JoinSession from './joinSession';
import { AnimatePresence,motion } from 'framer-motion';

const Landing = props => {
   
    const [modal_create, setModal_create] = React.useState(false);
    const [modal_join, setModal_join] = React.useState(false);
      
    const create_toggle = () => setModal_create(!modal_create);
    const join_toggle = () => setModal_join(!modal_join);

    
    return (
        <AnimatePresence>
        <motion.div className="landing" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
            <h1 className="title">Shobu</h1>
                <Button className="session-btn" color="primary" size="md" onClick={create_toggle} >Create Session</Button>
                <Modal isOpen={modal_create} toggle={create_toggle}>
                    <ModalHeader toggle={create_toggle}></ModalHeader>
                    <ModalBody>
                        <CreateSession/>
                    </ModalBody>
                </Modal>
                <Button className="session-btn" color="primary" size="md" onClick={join_toggle}>Join Session</Button>
                <Modal isOpen={modal_join} toggle={join_toggle}>
                    <ModalHeader toggle={join_toggle}></ModalHeader>
                    <ModalBody>
                        <JoinSession/>
                    </ModalBody>
                </Modal>
        </motion.div>
        </AnimatePresence>
    )
    
}

export default Landing;
