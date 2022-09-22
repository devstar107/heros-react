import React, { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import axios from "../axios";
import HeroModal from './modal'
import './heros.css'


const Heros = () => {
  const [heroes, setHeroes] = useState([]);
  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required("Full Name is required"),
    typeId: Yup.string().required("typeId is required"),
    description: Yup.string().required("Descrtion is required"),
    avatarUrl: Yup.string().required("avatarUrl is required"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, reset, formState } = useForm(formOptions);
  const { errors } = formState;
  const [open, setOpen] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);

  const [heroData, setHeroData] = useState(null)
  const {id, fullName, description, type} = heroData || {
    id: '',
    fullName:'',
    description:'',
    type:{
        id: '',
        name: ''
    }
  }

  useEffect(() => {
    axios.get(`/heroes`, {}).then((res) => {
      const hData = res.data.data;
      setHeroes(hData);
    });
  }, []);

  const saveHero = async (data) => {
    const response = await axios.post("/types", { "name": data.typeId });
    const id = response.data?.id;
    await axios.post(
      "/heroes",
      {
        fullName,
        avatarUrl,
        description,
        typeId:id,
      }).then((res) => {
        const data = res.data;
        const newHero = heroes.concat(data);
        setHeroes(newHero);
      })
    setOpenAdd(false)
  };

  const selecteHero = (e, data) => {
    setHeroData(data)
    setOpen(true)
  }

  return (
    <div>
       <HeroModal 
            open={open}
            setHeroes={setHeroes}
            setOpen={setOpen}
            id={id}
            avatarUrl={avatarUrl}
            fullName={fullName}
            description={description}
            type={type}
        />
      <button type="button" className="btn btn-primary mr-1" onClick={() => setOpenAdd(true)}>+ Add hero</button>
      <Modal show={openAdd}>
            <Modal.Header closeButton onClick={() => setOpenAdd(false)}>
              <Modal.Title>Add hero</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="card-body ">
                <img src='/static/avocado.png' className='col-4'/><br/>
                <form onSubmit={handleSubmit(saveHero)}>
                  <div className="form-row">
                    <div className="form-group col-12">
                      <label>avatarUrl</label>
                      <input
                        name="avatarUrl"
                        type="text"
                        {...register("avatarUrl")}
                        className={`form-control ${
                          errors.avatarUrl ? "is-invalid" : ""
                        }`}
                      />
                      <div className="invalid-feedback">
                        {errors.avatarUrl?.message}
                      </div>
                    </div>
                    <div className="form-group col-12">
                      <label>Full Name</label>
                      <input
                        name="fullName"
                        type="text"
                        {...register("fullName")}
                        className={`form-control ${
                          errors.fullName ? "is-invalid" : ""
                        }`}
                      />
                      <div className="invalid-feedback">
                        {errors.fullName?.message}
                      </div>
                    </div>
                    <div className="form-group col-12">
                      <label>typeId</label>
                      <select
                        name="typeId"
                        {...register("typeId")}
                        className={`form-control ${
                          errors.typeId ? "is-invalid" : ""
                        }`}
                      >
                        <option value=""></option>
                        <option value="Doctor">Doctor</option>
                        <option value="Animal">Animal</option>
                        <option value="Human">Human</option>
                        <option value="Plant">Plant</option>
                      </select>
                      <div className="invalid-feedback">{errors.typeId?.message}</div>
                    </div>
                    <div className="form-group col-12">
                      <label>Description</label>
                      <textarea
                        name="description"
                        type="text"
                        {...register("description")}
                        className={`form-control ${
                          errors.description ? "is-invalid" : ""
                        }`}
                      />
                      <div className="invalid-feedback">
                        {errors.description?.message}
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <button type="submit" className="btn btn-outline-success col-12">
                      Save
                    </button>
                    {/* <button
                      type="button"
                      onClick={() => reset()}
                      className="btn btn-outline-success col-12"
                    >
                      Reset
                    </button> */}
                  </div>
                </form>
              </div>
            </Modal.Body>
        </Modal>
        <table className="table table-hover text-left ">
              <thead className="table-success">
                <th>Heros</th>
                <th>Type</th>
                <th>Description</th>
              </thead>
              {heroes.map((item) => {
                return (
                      <tbody onClick={event => selecteHero(event, item)} key={item.id} >
                        <tr className='rounded-top'> 
                          <td>
                            <img src={item.avatarUrl} alt="Canvas Logo" className='img-fluid w-20 p-1' />
                            <span className='fw-bold'>{item.fullName}</span>                 
                          </td>
                          <td className='text-left align-middle'>
                           {item.type.name}
                          </td>
                          <td className='text-left align-middle'>
                            {item.description}
                          </td> 
                        </tr>
                        
                      </tbody>
                )
              })}
      </table>
    </div>
  );
};

export default Heros;
