import React from 'react'
import dynamic from 'next/dynamic'
import { useContext } from 'react'
import { Store } from '../../utils/Store'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useReducer } from 'react'
import axios from 'axios'
import { getError } from '../../utils/error'
import Layout from '../../components/layout'
import { Button, Card, CircularProgress, Grid, ListItem, ListItemText, Typography, List, CardContent, CardActions } from '@material-ui/core'
import useStyles from '../../utils/styles'
import NextLink from 'next/link'
import {Bar} from 'react-chartjs-2'

function reducer(state, action){
    switch(action.type){
        case "FETCH_REQUEST":
            return {...state, loading: true, error:''}
        case 'FETCH_SUCCESS':
            return {...state, loading: false, summary: action.payload, error:''}
        case 'FETCH_FAIL':
            return {...state, loading: false, error: action.payload}

        default:
            state
    }
}

function AdminDashboard() {
    const {state} = useContext(Store)
    const { userInfo } = state
    const router = useRouter()
    const classes = useStyles()

    const [{loading, error, summary}, dispatch] = useReducer(reducer, {loading: true, summary:{salesData: []}, error:''})

    useEffect(()=>{
        if(!userInfo){
            router.push('/login')
        }
        const fetchData = async () =>{
            try{
                dispatch({type: 'FETCH_REQUEST'})
                const {data} = await axios.get(`/api/admin/summary`,{
                    headers: {authorization: `Bearer ${userInfo.token}`}
                })
                dispatch({type:'FETCH_SUCCESS', payload:data})
            }catch(err){
                dispatch({type:'FETCH_FAIL', payload:getError(err)})
            }
        }
        fetchData()
    }, [])
    return (
        <Layout title='Dashboard'>
             <Grid container spacing={1}>
                <Grid item md={3} xs={12}>
                    <Card className={classes.section}>
                        <List>
                            <NextLink  href="/admin/dashboard" passHref>
                                <ListItem selected button component="a">
                                    <ListItemText primary="Admin Dashboard"></ListItemText>
                                </ListItem>
                            </NextLink>
                            <NextLink href="/admin/orders" passHref>
                                <ListItem  button component="a">
                                    <ListItemText primary="Orders"></ListItemText>
                                </ListItem>
                            </NextLink>
                            <NextLink href="/admin/products" passHref>
                                <ListItem button component="a">
                                    <ListItemText primary="Products"></ListItemText>
                                </ListItem>
                            </NextLink>
                            <NextLink href="/admin/users" passHref>
                                <ListItem button component="a">
                                    <ListItemText primary="Users"></ListItemText>
                                </ListItem>
                            </NextLink>
                        </List>
                    </Card>
                </Grid>
                <Grid item md={9} xs={12}>
                    <Card className={classes.section}>
                        <List>
                            
                            <ListItem>
                            {loading ? (<CircularProgress />)
                            :
                            error ? (<Typography className={classes.error}>{error}</Typography>)
                            :(
                                <Grid container spacing={5}>
                                    
                                    <Grid item md={3}>
                                        <Card raised>
                                            <CardContent>
                                                <Typography variant="h1">
                                                    ${summary.ordersPrice}
                                                </Typography>
                                                <Typography>Sales</Typography>
                                            </CardContent>
                                            <CardActions>
                                                <NextLink href="/admin/orders" passHref>
                                                    <Button size="small" color="primary">
                                                        View sales
                                                    </Button>
                                                </NextLink>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                    <Grid item md={3}>
                                        <Card raised>
                                            <CardContent>
                                                <Typography variant="h1">
                                                    {summary.ordersCount}
                                                </Typography>
                                                <Typography>Orders</Typography>
                                            </CardContent>
                                            <CardActions>
                                                <NextLink href="/admin/orders" passHref>
                                                    <Button size="small" color="primary">
                                                        View orders
                                                    </Button>
                                                </NextLink>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                    <Grid item md={3}>
                                        <Card raised>
                                            <CardContent>
                                                <Typography variant="h1">
                                                    {summary.productsCount}
                                                </Typography>
                                                <Typography>Products</Typography>
                                            </CardContent>
                                            <CardActions>
                                                <NextLink href="/admin/products" passHref>
                                                    <Button size="small" color="primary">
                                                        View Products
                                                    </Button>
                                                </NextLink>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                    <Grid item md={3}>
                                        <Card raised>
                                            <CardContent>
                                                <Typography variant="h1">
                                                    {summary.userCount}
                                                </Typography>
                                                <Typography>Users</Typography>
                                            </CardContent>
                                            <CardActions>
                                                <NextLink href="/admin/users" passHref>
                                                    <Button size="small" color="primary">
                                                        View Users
                                                    </Button>
                                                </NextLink>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                </Grid>
                            )}
                            </ListItem>
                            <ListItem>
                                <Typography component="h1" variant="h1">
                                    Sales Chart
                                </Typography>
                            </ListItem>
                            <ListItem>
                                <Bar data={{labels: summary.salesData.map((x)=> x._id),
                                datasets: [
                                    {
                                        labels: 'Sales',
                                        backgroundColor: 'rgba(162,222,208,1)',
                                        data: summary.salesData.map((x)=>x.totalSales)
                                    }
                                ]}}
                                options={{
                                    legend: {display: true, position: 'right'},
                                }}>
                                </Bar>
                            </ListItem>
                        </List>
                    </Card>
                </Grid>
            </Grid>
            
               
           

            
        </Layout>
    )
}

export default dynamic(()=> Promise.resolve(AdminDashboard),{ssr:false})