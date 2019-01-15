const quizMainDoctorData = "https://api.myjson.com/bins/xwu48";
const quizRegularDoctorData = "https://api.myjson.com/bins/gn9ko";

Vue.component('question', {
	template:`
<div>
	<div>
		<b>
			<div class="questions-counter"> 
				{{currentQuestion + 1}}/{{quizLength}}
			</div>
		</b>
		<h2>{{question.title}}</h2>
		<p class="quiz-description">{{question.description}}</p>
	</div>
	<div>
		<div class="form">
			<div v-for="(answer, index) in answers" style="flex:1">
				<div v-if="answer.isRight">
					<div class="inputGroup" v-bind:class="{ 'right-answer': questionAnswered }" :disabled="isDisabled">
						<span v-if="answer.hasPic" class="">
							<img class="rounded mx-auto d-block" :src='answer.linkToPic'>
						</span>
						<input type="radio" :id="'answer'+index" v-model="userAnswer" @click="changeDisabledState" :value="index">
						<label :for="'answer'+index" :disabled="isDisabled">{{answers[index].body}}</label>
					</div>
				</div>
				<div v-else>
					<div class="inputGroup" v-bind:class="{ 'wrong-answer': questionAnswered }" :disabled="isDisabled">
						<span v-if="answer.hasPic" class="">
							<img class="rounded mx-auto d-block" :src='answer.linkToPic'>
						</span>
						<input type="radio" :id="'answer'+index" v-model="userAnswer" @click="changeDisabledState" :value="index">
						<label :for="'answer'+index" :disabled="isDisabled">{{answers[index].body}}</label>
					</div>
				</div>
			</div>
			
			<div v-if="questionAnswered" class="alert-warning animated bounceIn"  style="padding-left:30px;">
				<p>{{question.hint}}</p>
			</div>

			<div style="text-align: center;">
				<button @click="checkAnswer" class = 'button' v-bind:class="{ 'disabled-button': isDisabled }" :disabled="isDisabled">Відповісти</button>
			</div>
			<div v-if="nextQuestion" @click="submitAnswer" style="text-align: center;">
				<button class="button">Далі</button>
			</div>
			<div v-if="lastQuestion" @click="endQuiz" style="text-align: center;">
				<button class="button" >Завершити</button>
			</div>
		</div>
	</div>
	
</div>
`,
  data() {
     return {
		questionAnswered: false,
		userPicked: [],
		isDisabled: true,
       	userAnswer: ''
     }
  },
	props:['question', 'answers', 'current-question', 'quiz-length', 'next-question', 'last-question'],
	methods:{
		checkAnswer: function() {
			if(!this.questionAnswered){
				this.questionAnswered = true;
				this.userPicked[this.userAnswer] = true;	
				if( false === this.answers[this.userAnswer].isRight){
					this.userPicked[this.userAnswer] = false;	
				}
				if (this.currentQuestion + 1 === this.quizLength) {
					this.lastQuestion = true;
				}
				else {
					this.nextQuestion = true;
				}
				this.isDisabled = true;
			}
		},
		changeDisabledState: function() {
			if(!this.questionAnswered)
				this.isDisabled = false;
		},
		submitAnswer: function() {
			this.$emit('user-answer', {
				answer: this.userAnswer,
				quizLength: this.quizLength,
				currentQuestion: this.currentQuestion
			});

			this.userAnswer = null;
			this.questionAnswered = false;
			this.userPicked[this.userAnswer] = false;
			this.nextQuestion = false;
			this.lastQuestion = false;
		},
		endQuiz: function() {
			this.$emit('end-quiz');

			this.userAnswer = null;
			this.questionAnswered = false;
			this.userPicked[this.userAnswer] = false;
			this.nextQuestion = false;
			this.lastQuestion = false;
		}
	}
});

var app = new Vue({
	el: '#test',
	data() {
		return {
			currentQuestion: 0,
			introFlag: false,
			quizFlag: false,
			resultFlag: false,
			mainDoctorFlag: false,
			regularDoctorFlag: false,
			nextQuestion: false,
			lastQuestion: false,

			rightAnswers: 0,
			percentage: 0,

			intro: {
					title: 'Medical Quiz',
					description: 'This is a quiz for doctors.\nChoose your role:',
					mainDoctor: 'Main doctor',
					regularDoctor: 'Doctor'
			},
			quizLength: 0,
			quiz:[],
			answers: []
		}
  },
  created() {
	this.introFlag = true;
  },

  methods: {
	loadMDData: function () {
		fetch(quizMainDoctorData)
		.then(res => res.json())
		.then(res => {
			this.currentQuestion = 0;
			this.nextQuestion = false;
			this.lastQuestion = false;
			this.rightAnswers = 0;
			this.percentage = 0;

			this.mainDoctorFlag = true; 
			this.regularDoctorFlag = false;
			this.introFlag = false; 
			this.quizFlag = true; 
			this.resultFlag = false;
			this.quizLength = res.quizLength;
			this.quiz = res.quiz;
			this.answers = res.answers;
		})
	},
	loadRDData: function () {
		fetch(quizRegularDoctorData)
		.then(res => res.json())
		.then(res => {
			this.currentQuestion = 0;
			this.nextQuestion = false;
			this.lastQuestion = false;
			this.rightAnswers = 0;
			this.percentage = 0;

			this.mainDoctorFlag = false; 
			this.regularDoctorFlag = true;
			this.introFlag = false; 
			this.quizFlag = true; 
			this.resultFlag = false;
			this.quizLength = res.quizLength;
			this.quiz = res.quiz;
			this.answers = res.answers;
		})
	},
	handleAnswer(e){
		if(this.answers[this.currentQuestion][e.answer].isRight === true) {
			this.rightAnswers++;
		}
		this.currentQuestion++;
		introFlag = false;
		quizFlag = true;
		resultFlag = false;
	},
	handleResults() {
		this.percentage = ((Number(this.rightAnswers) / Number(this.quizLength))*100).toFixed(0);
	},
	endQuiz(){
		this.handleResults();
		this.quizFlag = false;
		this.resultFlag = true;
	}
  }
});
