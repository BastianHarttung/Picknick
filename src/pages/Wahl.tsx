import classes from "./Wahl.module.scss";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { observer } from "mobx-react";
import { FiPlus } from "react-icons/fi";
import globalStore from "../stores/global-store";
import userStore from "../stores/user-store";
import { emptyParty } from "../mockup/testConstants";
import { IEssen, IParty } from "../interfaces/IParty";
import Button from "../ui-components/Button";
import ButtonCircle from "../ui-components/Button-Circle";
import Loading from "../ui-components/Loading";
import ModalNewFood from "../components/modals/modalNewFood";
import OrtAccordion from "../components/wahl/ortAccordion";
import FoodCheck from "../components/wahl/foodCheck";
import NoParty from "../components/noParty";
import { datumZuLocalString } from "../helper-functions/helper-functions";


const Wahl = () => {

  const {
    partyCollection,
    isLoading,
    speichereActiveId,
    speichereNotesCount,
    speichereAuswahl,
    speichereEssen,
    findKategorien,
    throwPopupMessage,
  } = globalStore;

  const {userName} = userStore;

  const params = useParams();
  const partyFind = partyCollection.find((part) => part.id.toString() === params.id);

  // const userCheckedEssen = () => {
  //   if (partyFind) {
  //     const essenArray = [];
  //     for (let i = 0; i < partyFind.essen.length; i++) {
  //       if (partyFind.essen[i].werBringts === userName) {
  //         essenArray.push(partyFind.essen[i].essenName);
  //       }
  //     }
  //     return essenArray;
  //   } else {
  //     return [];
  //   }
  // }

  const [party, setParty] = useState<IParty>(emptyParty);

  const [checkedEssen, setCheckedEssen] = useState<string[]>([]);

  const [isModalNewFoodOpen, setIsModalNewFoodOpen] = useState(false);

  function handleChecked(event: React.ChangeEvent<HTMLInputElement>) {
    const checked = event.target.checked;
    const essenName = event.target.value;

    let newChecked = checkedEssen;
    if (checked) {
      // Add essen to array
      newChecked.push(essenName);
    } else {
      // Filter Essen out of Array
      newChecked = newChecked.filter((item) => item !== essenName);
    }
    setCheckedEssen(newChecked);
  }

  function auswahlSpeichern() {
    if (userName) {
      speichereAuswahl(checkedEssen, userName, party);
      throwPopupMessage("Auswahl gespeichert", "success");
    }
  }

  const handleSaveNewFood = (foodObj: IEssen) => {
    speichereEssen(params.id, foodObj);
    setIsModalNewFoodOpen(false);
  };

  const essen = party.essen.slice().sort((a, b) => {
    if (a.werBringts === userName && b.werBringts !== userName) return -1
    if (a.werBringts !== userName && b.werBringts === userName) return 1
    if (a.werBringts === "" && b.werBringts !== "") return -1
    if (a.werBringts !== "" && b.werBringts === "") return 1
    else return 0
  })

  useEffect(() => {
    const userCheckedEssen = () => {
      if (partyFind) {
        const essenArray = [];
        for (let i = 0; i < partyFind.essen.length; i++) {
          if (partyFind.essen[i].werBringts === userName) {
            essenArray.push(partyFind.essen[i].essenName);
          }
        }
        return essenArray;
      } else return []
    }
    if (params.id) {
      speichereActiveId(params.id);
    }
    setCheckedEssen(userCheckedEssen)
    speichereNotesCount(partyFind?.notizen?.length ?? 0)
    setParty(partyFind ? partyFind : emptyParty);
  }, [partyFind, params.id, speichereActiveId, speichereNotesCount, userName]);


  if (isLoading) {
    return <Loading/>
  }

  if (!partyFind) {
    return <NoParty/>;
  }

  return (
    <section>
      <ModalNewFood isOpen={isModalNewFoodOpen}
                    onClose={() => setIsModalNewFoodOpen(false)}
                    onSave={handleSaveNewFood}
                    categories={findKategorien(party)}/>

      <h3 className={classes.partyName}>{party.partyName}</h3>

      <div className={classes.datumContainer}><b>Datum:</b><br/>
        <div id="datum" className="datum">{datumZuLocalString(party.datum)}</div>
      </div>

      <div className={classes.zeitContainer}><b>Zeit:</b><br/>
        <div id="zeit" className="zeit">{party.zeit} Uhr</div>
      </div>

      <OrtAccordion party={party}/>

      <div className={classes.infosContainer}><b>Infos:</b><br/>
        <textarea id="infos"
                  value={party.infos}
                  rows={7}
                  readOnly/>
      </div>

      <div id="checkbox-container" className={classes.checkboxContainer}>
        {essen.map((ess, index) => (
          <FoodCheck key={index}
                     essen={ess}
                     onChecked={handleChecked}
                     checkedEssen={checkedEssen}/>))}
      </div>

      <div id="essenBtnContainer"
           className={classes.essenBtnContainer}>
        <ButtonCircle
          onClick={() => setIsModalNewFoodOpen(true)}
          icon={<FiPlus/>}
          btnStyle="primary"
          size="18px"/>
      </div>

      <div className={classes.nameSpeichernContainer}>
        <Button onClick={auswahlSpeichern}>
          Auswahl speichern
        </Button>
      </div>

    </section>
  );

};

export default observer(Wahl);
