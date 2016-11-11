var Weahter = React.createClass({
    render: function() {
      
        return (
          <div className="city">
              <span className="delete-city" onClick={this.props.onDelete}> × </span>
              <p>{this.props.children}&deg;</p>
          </div>
        );
    }
});

var WeatherEditor = React.createClass({
  getInitialState: function() {
    return {
      temp: ''
    }
  },

  handleTextChange: function(event) {
    this.setState({temp: event.target.value});
  },

  handleCityAdd: function() {

    var self = this;
    var api = 'http://api.openweathermap.org/data/2.5/weather?q=' 
              + self.state.temp +'&=ru&units=metric&APPID=98c355d73f22c6eb33c4bc0bd22031fe'

     axios.get(api)
      .then(function (result) {

            self.setState({
              temp: Math.ceil(result.data.main.temp),
              city: result.data.name
            });

            var newCity = {
                temp: self.state.temp,
                city: self.state.city,
                id: Date.now()
            };

            self.props.onCityAdd(newCity);
            self.setState({ temp: '' });

      });
    
  },

   render: function() { 
       return (
          <div className="city-editor">
            
              <input 
                type="text"
                placeholder="Enter your city..." 
                className="input" 
                value={this.state.temp}
                onChange={this.handleTextChange}
              />

              <button className="add-button" onClick={this.handleCityAdd}>Add</button>
            
          </div>
       );
   }
    
});


var WeatherList = React.createClass({

    render: function() {
        var onCityDelete = this.props.onCityDelete;

        return (
            <div className="cities-list">
                {
                    this.props.cities.map(function(city){
                        return (
                            <Weahter
                                key={city.id}
                                onDelete={onCityDelete.bind(null, city)}
                                >
                                {city.city}: {city.temp}
                            </Weahter>
                        );
                    })
                }
            </div>
        );
    }
});

var WeatherApp = React.createClass({
    getInitialState: function() {
        return {
            cities: []
        };
    },

    componentDidMount: function() {

      var form = document.querySelector('.city-editor');
      var but = document.querySelector('.add-button');

      form.addEventListener("keypress", function(event) {
          if (event.keyCode == 13) {
              but.click();
          }
      });

       
        var localCities = JSON.parse(localStorage.getItem('cities'));
        if (localCities) {
            this.setState({ cities: localCities });
        }
    },

    componentDidUpdate: function() {
        this._updateLocalStorage();
    },

    handleCityDelete: function(city) {
        var cityId = city.id;
        var newCities = this.state.cities.filter(function(city) {
            return city.id !== cityId;
        });
        this.setState({ cities: newCities });
    },

    handleCityAdd: function(newCity) {
        var newCities = this.state.cities.slice();
        newCities.unshift(newCity);
        this.setState({ cities: newCities });
    },

    render: function() {
        return (
            <div className="cities-app">
                <h2 className="app-header">Weather</h2>
                <WeatherEditor onCityAdd={this.handleCityAdd} />
                <WeatherList cities={this.state.cities} onCityDelete={this.handleCityDelete} />
            </div>
        );
    },

    _updateLocalStorage: function() {
        var cities = JSON.stringify(this.state.cities);
        localStorage.setItem('cities', cities);
    }
});

ReactDOM.render(
    <WeatherApp />,
    document.getElementById('mount-point')
);