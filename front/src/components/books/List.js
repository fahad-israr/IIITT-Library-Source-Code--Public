import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';

import { toast } from 'react-toastify';	
import { css } from '@emotion/core';
import { ScaleLoader } from 'react-spinners';

const override = css`
    display:inline;
    margin-top: 0 auto;
    border-color: red;

`;

export default class List extends React.Component {

	constructor(){
		super();
		this.state = {
			search:'',
            name:'',
            roll:'',
            branch: '',
            year:'',
            phone:'',
            issued:'',
            id:'',
            found:false,
            bookid:'',
            loading:true
		};
		
	}






  searchstudent=(event)=>{
  	let s=event.target.value
  	this.setState({search:s},()=>{ fetch(`https://stark-hamlet-65683.herokuapp.com/students/${s}`,{
      method: 'get',
      headers: {'Content-Type': 'application/json'}
  }).then(response=>response.json()).then(data=>{if(data&&data.length>0)this.setState({found:true,name:data[0].name,roll:data[0].roll,branch:data[0].branch,year:data[0].year,phone:data[0].phone,id:data[0].id,issued:data[0].issued})});
})
    


  }



	static showModal(){
		document.getElementById("issueBook").showModal();
	}
	static hideModal(){
		document.getElementById("issueBook").close();
	}
	
	static preventHide(e){
		e.stopPropagation();
	}


  issue=()=>{
  	let {bookid,id,roll,bookname,name,author,publisher,edition,isbn}=this.state;

fetch('https://stark-hamlet-65683.herokuapp.com/bookissue', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        bookid:bookid,
        studentid:id,
        roll:roll,
        bookname:bookname,
        studentname:name,
        author:author,
        publisher:publisher,
        edition:edition,
        isbn:isbn
      })
    }).then(response=>response.json()).then(data=>{List.hideModal();
	this.props.fetchBooks();
	toast.info(data, {
                 position: toast.POSITION.BOTTOM_RIGHT,
                closeOnClick: true,
                pauseOnHover: true,
                autoClose:3000,
                draggable: true,
                
                hideProgressBar: false,
               
            });
});
	
  	
  }


    /* eslint-disable no-unused-vars */

	render(){
		let wid='20vw'
		let itemList;
		if(this.props.books && this.props.books.length > 0){

			const none=<div style={{"marginLeft":'20px'}}>-</div>
			
			itemList = this.props.books.map((item)=>{

				const none=<div style={{"marginLeft":'20px'}}>-</div>
				return(
					<tr key={item.id} className="tableRow"style={{fontSize:'0.9em'}}>
						<td className="" title="Click to know more about this book" style={{width:'20vw'}}>
						<Link to={"/book/"+item.id} draggable="false"  className="">{item.name}</Link>

						</td>
						<td className="">{item.isbn ? (item.isbn|| '-') : '-'}</td>
						<td className="">{item.author ? (item.author || '-') : '-'}</td>
						
						
						<td className="">{item.edition ? (item.edition || '-') : '-'}</td>
						<td className="">{item.publisher ? (item.publisher || '-') : '-'}</td>
						<td className="copies">{item.availablecopies ? (item.availablecopies || '-') : '-'}</td>
						<td className="">{item.stackno ? (item.stackno || '-') : '-'}</td>
						<td className="">
						

						{item.availablecopies? 

						<a style={{marginLeft:'4px'}} onClick={()=>{this.setState({bookid:item.id,bookname:item.name,author:item.author,publisher:item.publisher,edition:item.edition,isbn:item.isbn},List.showModal())}}>Issue</a>
					     :
					     <a style={{cursor:'not-allowed',opacity:'0.6',marginLeft:'4px'}}>Issue</a>
					     }

						</td>
					</tr>
				)
			})
		}
		
		else{
			itemList =  <tr key="nodata">
							<td className="noData" colSpan="6">
							 <div className='sweet-loading'>
					        <ScaleLoader
					          css={override}
					          sizeUnit={"px"}
					          color={'#0099cc'}
					          size={60}
					          height={35}
					          width={8}
					          radius={2}
					          loading={this.state.loading}
					        />
      						</div> 
							</td>
						</tr>

		}

		return(
			<div className="pageRow" id="booksBlock">
				<div className="thisBlock">
					<div className="blockBody">
						<div className="thisTable">
							<div className="tbl-header">
								<table>
									<thead>
									<tr>
										<th className="" style={{width:'20vw'}}>Name</th>
										<th className="">ISBN</th>
										<th className="">Author</th>
										<th className="">Edition</th>
										<th className="">Publisher</th>
										<th className="">Avl.Copies</th>
										<th className="">Stack</th>
										<th className=" ">Action</th>
									</tr>
									</thead>
								</table>
							</div>
							<div className="tbl-content">
								<table>
									<tbody>
										{itemList}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
										<dialog id="issueBook" className="dialogBox" onClick={List.hideModal} style={{width:'50vw'}}>
										<div className="dialogTitle" onClick={List.preventHide}>
											Issue Book
											<button onClick={List.hideModal}>X</button>
										</div>
										{!this.state.found||!this.state.search?
										<div className="dialogBody" onClick={List.preventHide} >

											<div style={{width:wid}}>
												<label>Search Student</label>
												<input onChange={this.searchstudent} name="search" placeholder="Search by Roll or Name" value={this.state.search}/>
											</div>
										</div>
												:

												<div className="dialogBody" onClick={List.preventHide} >

														<div style={{width:wid}}>
															<label>Search Student</label>
															<input onChange={this.searchstudent} name="search" placeholder="Search by Roll or Name" value={this.state.search}/>
														</div>
														<div style={{width:wid}}>
															<label>Name</label>
															<input  name="search" placeholder="Name" value={this.state.name}/>
														</div>
														<div style={{width:wid}}>
															<label>Roll</label>
															<input name="Roll" placeholder="Roll" value={this.state.roll}/>
														</div>
														<div style={{width:wid}}>
															<label>Year</label>
															<input  name="Year" placeholder="Year" value={this.state.year}/>
														</div>
														<div style={{width:wid}}>
															<label>Phone</label>
															<input  name="Phone" placeholder="Phone" value={this.state.phone}/>
														</div>
														<div style={{width:wid}}>
															<label>Issued Books</label>
															<input  name="issued" placeholder="None" value={this.state.issued}/>
														</div>

														<div style={{width:wid}}>
															<label>Recommended To Return By :</label>
															<input  name="recommend" placeholder="None" value={new Date((new Date()).getTime() + 14*24*60*60*1000).toDateString()}/>
														</div>

											  </div>
											}

											
											
											
											
										
										<div className="dialogFooter" onClick={List.preventHide}>
											<button onClick={this.issue} disabled={!this.state.found||!this.state.search||(this.state.issued>=3)}>Issue</button>
											<button onClick={List.hideModal}>Cancel</button>
										</div>
									</dialog>
               
			</div>
		)
	}
}