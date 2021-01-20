import React, { useState } from 'react'
import classes from './ContactData.module.css'
import Button from '../../../components/UI/Button/Button'
import Input from '../../../components/UI/Input/Input'
import axios from '../../../axios-orders'

const ContactData = props => {

    const [orderForm, setOrderForm] = useState({
        name: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'Your Name',
            },
            validation: {
                required: true
            },
            value: '',
            valid: false,
            touched: false
        },
        email: {
            elementType: 'input',
            elementConfig: {
                type: 'email',
                placeholder: 'Your Email'
            },
            validation: {
                required: true
            },
            value: '',
            valid: false,
            touched: false
        },
        street: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'Street'
            },
            validation: {
                required: true
            },
            value: '',
            valid: false,
            touched: false
        },
        zipCode: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'ZipCode'
            },
            validation: {
                required: true,
                maxLength: 5,
                minLength: 5
            },
            value: '',
            valid: false,
            touched: false
        },
        country: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'Country'
            },
            validation: {
                required: true
            },
            value: '',
            valid: false,
            touched: false
        },
        deliveryMethod: {
            elementType: 'select',
            elementConfig: {
                options: [
                    { value: 'cheapest', displayedValue: 'Cheapest' },
                    { value: 'fastest', displayedValue: 'Fastest' }
                ]
            },
            validation: {},
            value: 'cheapest',
            valid: true
        }
    })
    const [formIsValid, setFormIsValid] = useState(false)


    const checkValidity = (value, rules) => {
        let isValid = true
        if (rules.required) {
            isValid = value.trim() !== '' && isValid
        }
        if (rules.minLength) {
            isValid = value.length >= rules.minLength && isValid
        }
        if (rules.maxLength) {
            isValid = value.length <= rules.maxLength && isValid
        }
        return isValid
    }


    const onChangeHandler = (e, key) => {
        const newOrderForm = { ...orderForm }
        const newFormElem = { ...newOrderForm[key] }

        newFormElem.value = e.target.value
        newFormElem.valid = checkValidity(newFormElem.value, newFormElem.validation)
        newFormElem.touched = true
        newOrderForm[key] = newFormElem

        let isValid = true
        for (let key in newOrderForm) {
            isValid = newOrderForm[key].valid && isValid
        }
        setOrderForm(newOrderForm)
        setFormIsValid(isValid)
    }

    const placeOrder = e => {
        e.preventDefault()
        const contactData = {}
        for (let key in orderForm) {
            contactData[key] = orderForm[key].value
        }

        const orderData = {
            contactData,
            ingredients: props.ingredients,
            price: props.price,
        }
        axios.post('/orders.json', orderData)
            .then(() => props.history.push('/'))
            .catch(err => {
                props.history.push('/')
                alert(err.message)
            })

    }

    const ordersArr = []
    for (let key in orderForm) {
        ordersArr.push({ id: key, config: orderForm[key] })
    }

    return <div className={classes.ContactData}>
        <h3>Enter your data</h3>
        <form onSubmit={placeOrder}>
            {ordersArr.map(el =>
                <Input
                    key={el.id}
                    elementType={el.config.elementType}
                    elementConfig={el.config.elementConfig}
                    elementName={el.id}
                    value={el.config.value}
                    touched={el.config.touched}
                    invalid={!el.config.valid}
                    shouldValidate={el.config.validation}
                    change={e => onChangeHandler(e, el.id)} />)}
            <Button
                btnType='Success'
                disabled={!formIsValid}
                valid={formIsValid}>
                ORDER</Button>
        </form>
    </div>
}

export default ContactData
