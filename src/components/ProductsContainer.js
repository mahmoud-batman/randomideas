import React, { useState, useEffect }  from 'react'
import './ProductsContainer.css';
import ProductBox from './ProductBox';
import getRandomInt from 'utils/getRandomInt';

export default function ProductsContainer({data}) {
    const [autoDisplayIsActive, setAutoDisplayIsActive] = useState(false);
    const [firstTime, setFirstTime] = useState(true);
    const [timer, setTimer] = useState(1);
    let [seconds, setSeconds] = useState(1);
    let [repeat, setRepeat] = useState(1);

    // To create an array equal to the length of the number of categoryItems
    const [categoryItems, setCategoryItems] = useState([]);
    // const [categoryItems, setCategoryItems] = useState(new Array(data.length).fill([]));

    // To create an array equal to the length of the number of checkboxes
    const [checkedState, setCheckedState] = useState(
        new Array(data.length).fill(false)
    );

    const handleOnChange = (position) => {
        const updatedCheckedState = checkedState.map((item, index) =>
            index === position ? !item : item
        );
        setCheckedState(updatedCheckedState);
        categoryChecked()
    };
    
    const categoryChecked = () => {
        return data.map((obj, index) =>
            checkedState[index] && obj.category 
        )
    }

    const categoryCheckedItems = () => {
        return data.filter(obj => categoryChecked().includes(obj.category)).map(
            category => (
                category.items
            )
        )
    }

    const randomItems = () => {
        let randomNumList = []
        let randomItemsList = []
       
        for (let index = 0; index < categoryCheckedItems().length; index++) {

            for (let i = 0; i < repeat; i++) {
                randomNumList.push(getRandomInt(1, categoryCheckedItems()[index].length)).toString()
            }
            randomItemsList.push(
                categoryCheckedItems()[index].filter(
                    items => randomNumList.includes(parseInt(items.rank))
                )
            )
            randomNumList = []      
        }
        
        return randomItemsList.flat(1)
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

    function onRepeat(e) {   
        setRepeat(e.target.value);
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
            { categoryItems.length > 0 &&  categoryItems.map(
                item => <ProductBox key={item.id} item = {item} />
            )}
        </div>
        <div className="buttonsContainer">

        <div className="timer">
                <input className={`${autoDisplayIsActive && 'disabled'}`}
                id='timer'
                name='timer'
                type='number' 
                min = '1'
                value = {timer}
                onChange={(e) => onTimer(e)}
                />
                <b htmlFor="timer">{`${autoDisplayIsActive ? seconds + " sec" : "Timer"}  ` } </b>
            
                <input className={`${autoDisplayIsActive && 'disabled'}`}
                    id='repeat'
                    name='repeat'
                    type='number'
                    min = '1' 
                    value = {repeat}
                    onChange={(e) => onRepeat(e)}
                />                
                <b htmlFor="timer">Repeater </b>
            </div>
           
            <div className='timerContainer'>
                <button  className={`button  fa fa-${autoDisplayIsActive ?  'pause-circle ': 'play-circle search' } 
                ${firstTime && 'disabled'} ${!checkedState.includes(true)   && 'disabled'}`} 
                onClick={toggle}>
                    {console.log()}
                    &nbsp;{autoDisplayIsActive ? 'Pause' : 'Start'}
                </button>
                
            </div>
            
            <button className={`button search ${autoDisplayIsActive  && 'disabled'} ${!checkedState.includes(true)   && 'disabled'}`} onClick={() => search()}>
                <i className="fa fa-search "></i> Search</button> 
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
