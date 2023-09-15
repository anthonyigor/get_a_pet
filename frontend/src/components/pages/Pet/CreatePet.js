import api from '../../../utils/api'
import styles from './CreatePet.module.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import useFlashMessage from '../../../hooks/useFlashMessage'

function CreatePet() {
    return (
        <section className={styles.createpet_header}>
            <div>
                <h1>Cadastrar um pet</h1>
                <p>Logo após ele ficará disponível para adoção</p>
            </div>
            <p>Form</p>
        </section>
    )
}

export default CreatePet