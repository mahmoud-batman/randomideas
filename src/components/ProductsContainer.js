import React, { useState, useEffect }  from 'react'
import './ProductsContainer.css';
import ProductBox from './ProductBox';
import getRandomInt from 'utils/getRandomInt';

export default function ProductsContainer({data}) {
    const [autoDisplayIsActive, setAutoDisplayIsActive] = useState(false);
    const [firstTime, setFirstTime] = useState(true);
    const [timer, setTimer] = useState(1);
    let [seconds, setSeconds] = useState(1);

    // To create an array equal to the length of the number of categoryItems
    const [categoryItems, setCategoryItems] = useState(new Array(data.length).fill([]));

    // To create an array equal to the length of the number of checkboxes
    const [checkedState, setCheckedState] = useState(
        new Array(data.length).fill(false)
    );

    const handleOnChange = (position) => {
        const updatedCheckedState = checkedState.map((item, index) =>
            index === position ? !item : item
        );
        setCheckedState(updatedCheckedState);
        categorySelected()
    };
    
    const categorySelected = () => {
        return data.map((obj, index) =>
            checkedState[index] && obj.category 
        )
    }

    const itemSelected = () => {
        return data.filter(obj => categorySelected().includes(obj.category)).map(
            category => (
                category.items
            )
        )
    }

    const randomItems = () => {
        let randomNumList = []
        let randomItemsList = []
        let categoryItemsList = itemSelected().map(
            category => (
                category
            )
        )
        
        itemSelected().map(category => 
            randomNumList.push(getRandomInt(1, category.length)).toString())
       
        randomItemsList.push(itemSelected().map(
            (itemsList, index) => itemsList.filter(item => 
                item.rank == randomNumList[index])
        ))

        return randomItemsList[0]
    }

    function search () {
        setCategoryItems(randomItems())
        setFirstTime(false)
    }

    function resetFilter () {
        resetFilter = new Array(data.length).fill(false)
        setCheckedState(resetFilter)
        setFirstTime(true)
    }   

    function selectAll () {
        resetFilter = new Array(data.length).fill(true)
        setCheckedState(resetFilter)
        setFirstTime(true)
    }

    function toggle() {
        setAutoDisplayIsActive(!autoDisplayIsActive);
    }  

    function onTimer(e) {   
        setTimer(e.target.value);
    }

    
    useEffect(() => {
        let interval = null;
        let secondInterval = null
        let s = seconds
        setSeconds(s)
        
        if(autoDisplayIsActive){
            secondInterval = setInterval(() => {

                if (s == timer) { 
                    s = 0
                    search()
                    setFirstTime(false)
                }
                s += 1
                setSeconds(s)
            }, 1000)

        }
        return () =>{ 
            clearInterval(interval)
            clearInterval(secondInterval)
        };
        
    }, [autoDisplayIsActive])

    return (
        
        <>
       
        
        <div className="productsContainer">
            {categoryItems.map(
                items => (
                    items.length > 0 ? 
                    items.map(item => <ProductBox key={item.id} item = {item} />)
                    : ""
                )
            )}
        </div>
        <div className="buttonsContainer">

            <button className={`button search ${autoDisplayIsActive && 'disabled'}`} onClick={() => search()}>
                <i className="fa fa-search "></i> Search</button> 

           
            <div className='timerContainer'>
                <button  className={`button  fa fa-${autoDisplayIsActive ?  'pause-circle ': 'play-circle search' } 
                ${firstTime && 'disabled'}`} 
                onClick={toggle}>
                    {console.log()}
                    &nbsp;{autoDisplayIsActive ? 'Pause' : 'Start'}
                </button>
                <div>
                    <input className={`${autoDisplayIsActive && 'disabled'}`}
                    id='timer'
                    name='timer'
                    type='number' 
                    min = {timer}
                    max = '10'
                    value = {timer}
                    onChange={(e) => onTimer(e)}
                    />
                    <label htmlFor="timer">{`${autoDisplayIsActive ? seconds + " sec" : "Timer"}  ` } </label>
                </div>
                
            </div>

        </div>
        <div className={`filterGroup ${autoDisplayIsActive && 'disabled hidden'  }  display=hidden`}>
            {data.map((list, index) =>    
                <label key = {list.category} className="container" >
                    {list.category}

                    <input
                        type="checkbox"
                        id={list.category}
                        name={list.category}
                        value={list.category}
                        checked={checkedState[index]}
                        onChange={() => handleOnChange(index)}
                    />
                    <span className="checkmark"></span>
                </label>
            )}
        </div>
        <div className={ `buttonsContainer ${autoDisplayIsActive && 'disabled hidden'  }`}>
            <button className="button" onClick={() => resetFilter()}>
                <i className="fa fa-remove "></i> resetFilter</button>   

            <button className="button" onClick={() => selectAll()}>
                <i className="fa fa-check "></i> selectAll</button>
        </div>
        </>
    )
}
