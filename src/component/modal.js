import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import axios from "../axios";


const HeroModal = ({open, id, fullName, avatarUrl, description, type, setOpen, setHeroes}) => {
    const deleteHero = async () => {
        await axios.delete('/heroes/' + id)
        await axios.get(`/heroes`, {}).then((res) => {
            const dataa = res.data.data;
            setHeroes(dataa);
          });
        setOpen(false)
    }
    return (
        <>
        <Modal show={open}>
            <Modal.Header closeButton onClick={() => setOpen(false)}>
            </Modal.Header>
            <Modal.Body>
                <Form >
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <img src={avatarUrl} className='img' className='mx-auto d-block'/><br/>
                        <h3 className='mb-2 fw-bold text-center'>{fullName}</h3>
                        <h5 className='text-center'>{type.name}</h5>
                        <h5 className='text-center'>{description}</h5>  
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" type='submit' className='mx-auto d-block btn btn-danger' onClick={deleteHero}>
                Delete Hero
            </Button>
            </Modal.Footer>
        </Modal>
        
        </>
    );
}

export default HeroModal;