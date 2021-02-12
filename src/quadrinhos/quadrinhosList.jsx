import React, { Component } from 'react'
import { connect } from 'react-redux'
import Row from '../template/row'
import IconButton from '../template/iconButton'
import ComicBook from '../template/comicBook'
import { toastr } from 'react-redux-toastr'
import Modal from 'react-modal'
import MyModal from '../components/Modal/modal'
import ModalEmail from '../components/Modal/modalEmail'

const selectedList = []

const customStyles = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)',
      maxHeight             : '100vh',
      overFlowY             : 'auto'
    }
  };

class quadrinhosList extends Component {
    
    constructor(props) {
        super(props)
        this.renderRows = this.renderRows.bind(this)
        this.selectComics = this.selectComics.bind(this)
        this.showModal = this.showModal.bind(this)
        this.closeModal = this.closeModal.bind(this)
        this.state = {showModal: false,
        selectedComic: []}
    }

    componentWillMount() {
        Modal.setAppElement('body');
    }

    showModal(value, quadrinhos) {
        let data = new Date(quadrinhos.dates[0].date);
        let dataFormatada = ((data.getDate() + "/" + ((data.getMonth() + 1)) + "/" + data.getFullYear() )) ;
        quadrinhos.dates[1].date = dataFormatada.toString()
        this.setState({...this.state, showModal: value, selectedComic: quadrinhos})
    }

    closeModal(value, quadrinhos) {
        this.setState({...this.state, showModal: value, selectedComic: quadrinhos})
    }

    selectComics(quadrinhos) {
        if(quadrinhos.isSelected){
            quadrinhos.isSelected = false
            const index = selectedList.indexOf(quadrinhos);
            if (index > -1) {
                selectedList.splice(index, 1);
            }
            toastr.light('Sucesso!', 'Quadrinho removido da seleção!')
            this.closeModal(false, quadrinhos)    
        } else {
            quadrinhos.isSelected = true
            selectedList.push(quadrinhos)
            toastr.success('Sucesso!', 'Quadrinho selecionado com sucesso!')
            this.closeModal(false, quadrinhos)
        }
        console.log(selectedList)
    }

    renderRows(){
        const list = this.props.list || []
        return list.map(quadrinhos => (
               <ComicBook key={quadrinhos.id} 
               title={quadrinhos.title} 
               comicCover={quadrinhos.thumbnail.path +"."+ quadrinhos.thumbnail.extension}>
                   <div className='botoesquadrinho'>
                   <IconButton title={quadrinhos.isSelected? 'Desselecionar': 'Selecionar'} style={quadrinhos.isSelected? 'danger': 'success'} icon={quadrinhos.isSelected? 'window-close': 'check'} onClick={() => this.selectComics(quadrinhos)}></IconButton>
                   <IconButton title='Ver detalhes' style='success' onClick={() => this.showModal(true, quadrinhos)}></IconButton>
                   </div>
               </ComicBook>
               
        ))
    }

    render() {
        return (
        <div>
            <Modal isOpen={this.state.showModal} style={customStyles}>
                <MyModal quadrinho={this.state.selectedComic} onClose={this.closeModal} onSelect={this.selectComics}/>
            </Modal>
            <Row>
                {this.renderRows()}
            </Row>
            <ModalEmail listQuadrinhos={selectedList}/>
        </div>
        )
    } 
}

const mapStateToProps = state => ({list: state.quadrinhos.list})
export default connect(mapStateToProps)(quadrinhosList)