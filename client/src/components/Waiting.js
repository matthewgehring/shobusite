import React from 'react'
import {motion,AnimatePresence} from 'framer-motion';
import {Button, Spinner} from 'reactstrap';

const Waiting = ({code}) => {
    return (
        <AnimatePresence>
          <motion.div className="waiting-lobby" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} >
              <h5>Waiting for someone to join</h5>
              <Spinner color="dark"></Spinner>
              <h6>Click to Copy Session Code:</h6>
              <Button onClick={()=> {navigator.clipboard.writeText(code)}}>{code}</Button>
          </motion.div>
        </AnimatePresence>
    )
}

export default Waiting;