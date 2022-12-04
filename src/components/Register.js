import React, { useContext, useState } from 'react'
import { NavLink, useHistory } from 'react-router-dom'
import { adddata } from './context/ContextProvider';

const Register = () => {

    const { udata, setUdata } = useContext(adddata);

    const history = useHistory();

    const [inpval, setINP] = useState({
        title: "",
        excerpt: "",
        userId: "",
        ISBN: "",
        category: "",
        subcategory: "",
        reviews: "",
        releasedAt:"",
        bookCover:""
    })

    const setdata = (e) => {
        console.log(e.target.value);
        const { name, value } = e.target;
        setINP((preval) => {
            return {
                ...preval,
                [name]: value
            }
        })
    }


    const addinpdata = async (e) => {
        e.preventDefault();

        const {title, excerpt,userId,ISBN,category,subcategory,reviews,releasedAt,bookCover} = inpval;


        if (title == "") {
            alert("title is required")
        } else if (excerpt == "") {
            alert("excerpt is required")
        } else if (ISBN =="") {
            alert("enter valid ISBN")
        } else if (category == "") {
            alert("category is required")
        } else if (subcategory == "") {
            alert("subcategory is required")
        } else if (reviews == "") {
            alert("reviews is required")
        } else if (releasedAt == "") {
            alert("age is required")
        } else {

            const res = await fetch("/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title, excerpt,userId,ISBN,category,subcategory,reviews,releasedAt,bookCover
                })
            });

            const data = await res.json();
            console.log(data);

            if (res.status === 422 || !data) {
                console.log("error ");
                alert("error");

            } else {
                history.push("/")
                setUdata(data)
                console.log("data added");

            }
        }

    }

    return (
        <div className="container">
            <NavLink to="/">home</NavLink>
            <form className="mt-4">
                <div className="row">
                    <div class="mb-3 col-lg-6 col-md-6 col-12">
                        <label for="exampleInputEmail1" class="form-label">Title</label>
                        <input type="text" value={inpval.title} onChange={setdata} name="title" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
                    </div>
                    <div class="mb-3 col-lg-6 col-md-6 col-12">
                        <label for="exampleInputPassword1" class="form-label">excerpt</label>
                        <input type="text" value={inpval.excerpt} onChange={setdata} name="excerpt" class="form-control" id="exampleInputPassword1" />
                    </div>
                    <div class="mb-3 col-lg-6 col-md-6 col-12">
                        <label for="exampleInputPassword1" class="form-label">userId</label>
                        <input type="text" value={inpval.userId} onChange={setdata} name="userId" class="form-control" id="exampleInputPassword1" />
                    </div>
                    <div class="mb-3 col-lg-6 col-md-6 col-12">
                        <label for="exampleInputPassword1" class="form-label">ISBN</label>
                        <input type="number" value={inpval.ISBN} onChange={setdata} name="ISBN" class="form-control" id="exampleInputPassword1" />
                    </div>
                    <div class="mb-3 col-lg-6 col-md-6 col-12">
                        <label for="exampleInputPassword1" class="form-label">category</label>
                        <input type="text" value={inpval.category} onChange={setdata} name="category" class="form-control" id="exampleInputPassword1" />
                    </div>
                    <div class="mb-3 col-lg-6 col-md-6 col-12">
                        <label for="exampleInputPassword1" class="form-label">subcategory</label>
                        <input type="text" value={inpval.subcategory} onChange={setdata} name="subcategory" class="form-control" id="exampleInputPassword1" />
                    </div>
                    <div class="mb-3 col-lg-12 col-md-12 col-12">
                        <label for="exampleInputPassword1" class="form-label">reviews</label>
                        <textarea type="text" name="reviews" value={inpval.reviews} onChange={setdata} className="form-control" id="" cols="30" rows="5"></textarea>
                    </div>
                    <div class="mb-3 col-lg-6 col-md-6 col-12">
                        <label for="exampleInputPassword1" class="form-label">releasedAt</label>
                        <input type="date" value={inpval.releasedAt} onChange={setdata} name="releasedAt" class="form-control" id="exampleInputPassword1" />
                    </div>
                    <div class="mb-3 col-lg-6 col-md-6 col-12">
                        <label for="exampleInputPassword1" class="form-label">bookCover</label>
                        <input type="file" value={inpval.bookCover} onChange={setdata} name="bookCover" class="form-control" id="exampleInputPassword1" />
                    </div>

                    <button type="submit" onClick={addinpdata} class="btn btn-primary">Submit</button>
                </div>
            </form>
        </div>
    )
}
export default Register;
