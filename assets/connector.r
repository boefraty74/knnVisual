N0 = 9950
N1 = N0
N2 = N0

Mean0 = 5
Mean1 = 10
Mean2 = 20
N = 50

data0 = data.frame(id = seq(1,N0),x = rnorm(N0,mean = Mean0 , sd = 1), y = rnorm(N0,mean = Mean0 , sd = 1), label = rep(0,N0))

lastID = N0;


data1 = data.frame(id = seq(lastID+1,lastID+N1),x = rnorm(N1,mean = Mean1 , sd = 1), y = rnorm(N1,mean = Mean1 , sd = 1), label = rep(1,N1))
lastID = lastID+N1;


data2 = data.frame(id = seq(lastID+1,lastID+N2),x = rnorm(N2,mean = Mean2 , sd = 1), y = rnorm(N2,mean = Mean2 , sd = 1), label = rep(2,N2))
lastID = lastID+N1;


dataA = data.frame(id = seq(lastID+1,lastID+N),x = rnorm(N,mean = Mean0 , sd = 1), y = rnorm(N,mean = Mean0 , sd = 1), label = rep(-1,N))
lastID = lastID+N;
dataB = data.frame(id = seq(lastID+1,lastID+N),x = rnorm(N,mean = Mean1 , sd = 1), y = rnorm(N,mean = Mean1 , sd = 1), label = rep(-1,N))
lastID = lastID+N;
dataC = data.frame(id = seq(lastID+1,lastID+N),x = rnorm(N,mean = Mean2 , sd = 1), y = rnorm(N,mean = Mean2 , sd = 1), label = rep(-1,N))
lastID = lastID+N;


dataTrain = rbind(data0,data1,data2)
dataTest = rbind(dataA,dataB,dataC)

dataAll = rbind(dataTrain,dataTest)

write.csv(dataTrain,file = "dataTrainSynthBig.csv", sep = ",", row.names = FALSE)
write.csv(dataTest,file = "dataTestSynthBig.csv", sep = ",", row.names = FALSE)
write.csv(dataAll,file = "dataTrainTestSynthBig.csv", sep = ",", row.names = FALSE)


#plot(dataAll)