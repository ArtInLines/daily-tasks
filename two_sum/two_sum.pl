twoSum([],Target,[]).
twoSum([H|T],Target,X) :- tsHelper(T,H,Target,X).

tsHelper([],_,_,[]).
tsHelper([X],Y,T,[Y,X]) :- T=X+Y.
tsHelper([_],_,_,[]).
tsHelper([H|T],X,Target,[X,H]) :- Target==H+X.
tsHelper([H|T],X,Target,S) :- tsHelper(T,X,Target,S), S=[_|_].
tsHelper([H|T],X,Target,S) :- tsHelper(T,H,Targt,S).


% funktioniert nicht