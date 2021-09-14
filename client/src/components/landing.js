import React from 'react';
import {Button, Modal, ModalHeader, ModalBody} from 'reactstrap';
import CreateSession from './createSession';
import JoinSession from './joinSession';
import {AnimatePresence, motion } from 'framer-motion';

const Landing = props => {
   
    const [modal_create, setModal_create] = React.useState(false);
    const [modal_join, setModal_join] = React.useState(false);
      
    const create_toggle = () => setModal_create(!modal_create);
    const join_toggle = () => setModal_join(!modal_join);

    
    return (

            <motion.div className="landing" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                <div className="br4 ba b--black-10 mv4 w-100 w-50-m w-25-l shadow-5 center">
                <h1 className="title">Shobu</h1>
                    <Button className="session-btn f6 dim ba br2 bw1 ph3 pv2 mr2 mb2 dib black bg-transparent" size="md" onClick={create_toggle} >Create Session</Button>
                    <Modal isOpen={modal_create} toggle={create_toggle} >
                        <ModalHeader className="modal"  toggle={create_toggle}></ModalHeader>
                        <ModalBody className="modal bg-white br4 shadow-5" >
                            <CreateSession/>
                        </ModalBody>
                    </Modal>
                    <Button outline className="session-btn f6 link dim ba br2 bw1 ph3 pv2 mb2 dib black bg-transparent" size="md" onClick={join_toggle}>Join Session</Button>
                    <Modal isOpen={modal_join} toggle={join_toggle}>
                        <ModalHeader className="modal"  toggle={join_toggle}></ModalHeader>
                        <ModalBody className="modal bg-white br4 shadow-5" >
                            <JoinSession/>
                        </ModalBody>
                    </Modal>
                    </div>
                </motion.div>



    )
    
}

export default Landing;
