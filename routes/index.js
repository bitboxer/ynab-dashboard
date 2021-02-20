const router = require('express').Router();
const fetch = require('node-fetch');

const apiUrl = 'https://api.youneedabudget.com/v1';
const options = {Authorization: `Bearer ${process.env.YNAB_ACCESS_TOKEN}`};

const getCategories = (param) => {
  if (param) {
    if (typeof param == 'string') {
      return [param]
    }
    return param
  }
  return null
}

router.get('/:budgetId', async (req, res) => {
  const response = await fetch(`${apiUrl}/budgets/${req.params.budgetId}`, {headers: options});
  const json = await response.json();
  if (json.error) {
    res.send(json)
    return;
  }
  const budget = json.data.budget;
  const currency = budget.currency_format.currency_symbol;
  const selectedCategories = getCategories(req.query.categories)

  const categories = budget.categories.filter(category => !selectedCategories || selectedCategories.includes(category.name))
                            .filter(category => !category.deleted)
                            .map(category => ({...category, budget_percentage: category.balance / ((category.activity * -1 + category.balance) / 100)}))

  res.render('index', { currency, categories });
});

router.get('/', async (req, res) => {
  res.send("Select a budget with /BUDGET_ID")
});

module.exports = router;
