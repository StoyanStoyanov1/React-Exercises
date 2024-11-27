import LineChart from '../components/dashboard/LineChart'

const datas = [
{   type: 'Orders',
    info: [
        { month: 'Jan', value: 4000, monthNum: 1},
        { month: 'Feb', value: 3000, monthNum: 2},
        { month: 'Mar', value: 5000, monthNum: 3},
        { month: 'Apr', value: 4000, monthNum: 4},
        { month: 'May', value: 4500, monthNum: 5 },
        ],

},
{   type: 'Products',
    info: [
        { month: 'Jan', value: 4000, monthNum: 1},
        { month: 'Feb', value: 3000, monthNum: 2},
        { month: 'Mar', value: 5000, monthNum: 3},
        { month: 'Apr', value: 4000, monthNum: 4},
        { month: 'May', value: 3200, monthNum: 5 },
        ],

},
{   type: 'Other',
    info: [
        { month: 'Jan', value: 4000, monthNum: 1},
        { month: 'Feb', value: 3000, monthNum: 2},
        { month: 'Mar', value: 5000, monthNum: 3},
        { month: 'Apr', value: 4000, monthNum: 4},
        { month: 'May', value: 4000, monthNum: 5 },
        ],

},

];

function Dashboard() {

    return (
        <>
            {datas.map((data, index) => (
                <LineChart data={data} index={index} key={index} />
            ))}
        </>
    )
};

export default Dashboard;