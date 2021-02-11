const Modal = {
    toggle() {
        //toggle é um boolean, ele é como um tenario, se tiver ele tira a classe, sençao ele adiciona
        document.querySelector(".modal-overlay").classList.toggle('active')
    }
}

const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
    },

    set(transactions) {
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))
    }
}

const Transaction = {
    all: Storage.get(),
    add(transaction) {
        Transaction.all.push(transaction)
        App.reload()
    },

    remove(index) {
        Transaction.all.splice(index, 1)
        App.reload()
    },

    incomes() {
        let income = 0;
        //somar entradas
        Transaction.all.forEach(transaction => {
            if (transaction.amount > 0) income += transaction.amount;
        })
        return income
    },

    expenses() {
        let expense = 0
        //somar saídas
        Transaction.all.forEach(transaction => {
            if (transaction.amount < 0) expense += transaction.amount;
        })
        return expense
    },

    total() {
        //total = entradas - saídas
        return Transaction.incomes() + Transaction.expenses();
    }
}

const DOM = {
    transactionCotainer: document.querySelector('#data-table tbody'),
    addTransaction(transaction, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innetHtmlTransaction(transaction, index)
        tr.dataset.index = index

        DOM.transactionCotainer.appendChild(tr)
    },

    innetHtmlTransaction(transaction, index) {
        const CSSclass = transaction.amount >= 0 ? 'income' : 'expense'
        const amount = Utils.formatCurrency(transaction.amount)
        const html = `
            <td class="desciption">${transaction.description}</td>
            <td class='${CSSclass}'>${amount}</td>
            <td class='date'>${transaction.date}</td>
            <td>
                <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="">
            </td>
        `
        return html;
    },

    updateBalance() {
        document
            .querySelector('#incomeDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.incomes())
        document
            .querySelector('#expenseDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.expenses())
        document
            .querySelector('#totalDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.total())
    },

    clearTransactions() {
        DOM.transactionCotainer.innerHTML = ''
    }

}

const Utils = {

    formatAmout(value) {
        value = Number(value) * 100
        return value
    },

    formatDate(date) {
        const splittedDate = date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

    formatCurrency(value) {
        const signal = Number(value) < 0 ? '-' : ''
        value = String(value).replace(/\D/g, "")
        value = Number(value) / 100
        value = value.toLocaleString('pt-br', {
            style: "currency",
            currency: "BRL"
        })

        return signal + value
    }

}

const Form = {
    description: document.querySelector("#description"),
    amount: document.querySelector("#amount"),
    date: document.querySelector("#date"),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value,
        }
    },


    validateFields() {

        const { description, amount, date } = Form.getValues()

        if (description.trim() === '' ||
            amount.trim() === '' ||
            date.trim() === ''
        ) throw new Error("A descrição não pode ficar vazia")

    },

    formatData() {
        let { description, amount, date } = Form.getValues()
        amount = Utils.formatAmout(amount)
        date = Utils.formatDate(date)
        return {
            description,
            amount,
            date,
        }
    },

    clearFields() {
        Form.description.value = ''
        Form.amount.value = ''
        Form.date.value = ''
    },

    submit(event) {
        event.preventDefault()
        try {
            Form.validateFields()
            Transaction.add(Form.formatData())
            Form.clearFields()
            Modal.toggle()
        } catch (error) {
            alert(error.message)
        }

    }
}

const App = {
    init() {
        Transaction.all.forEach(DOM.addTransaction)
        DOM.updateBalance()
        Storage.set(Transaction.all)
    },

    reload() {
        DOM.clearTransactions()
        App.init()
    },
}

App.init()